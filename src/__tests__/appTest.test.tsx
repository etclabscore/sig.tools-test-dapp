import React from "react";
import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { IContext, rawAppMachine } from "../machines/appMachine";
import MyApp from "../containers/MyApp";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { TestPlan } from "@xstate/test/lib/types";
import { act } from "react-dom/test-utils";
import { Page } from "puppeteer";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
jest.setTimeout(95000);
page.setDefaultTimeout(60000);
const applicationMachine = Machine<any, any, any>(rawAppMachine);
const testApplicationMachine = applicationMachine;
const applicationModel = createModel(testApplicationMachine, {
  events: {
    "CONNECT": async (page: Page) => {
      await page.click("#connect");
      const pages = await browser.pages();
      const popup = pages[pages.length - 1];
      await popup.waitFor(5000);
      await popup.waitForSelector("#request-permissions #submit", {
        visible: true,
        timeout: 30000,
      });
    },
    "done.invoke.fetchingChainId.sig.tools": {
      exec: async (page: Page) => {
        await page.waitFor(3000);
      },
      cases: [
        {
          type: "done.invoke.fetchingChainId.sig.tools",
          data: "0x0",
        },
      ],
    },
    "error.platform.fetchingChainId.sig.tools": {
      cases: [
        {
          type: "error.platform.fetchingChainId.sig.tools",
          data: {
            code: 32009,
            message: "Some error",
          },
        },
      ],
    },
    "done.invoke.connecting.sig.tools": {
      exec: async (page: Page) => {
        const pages = await browser.pages();
        const popup = pages[pages.length - 1];
        // try {
        await popup.click("#request-permissions > div > div:nth-child(2) > ul > li:nth-child(1) > div.MuiButtonBase-root.MuiListItem-root.MuiListItem-gutters.MuiListItem-button.MuiListItem-secondaryAction > div > p", {delay: 1000}); //tslint:disable-line
        await popup.click("#request-permissions #submit", { delay: 1000 });
        await popup.waitForSelector("#success", { visible: true, timeout: 5000 });
        await popup.waitFor(3000);
        // } catch (e) {
        // do nothing
        // }
      },
      cases: [
        {
          type: "done.invoke.connecting.sig.tools",
          data: [
            { name: "foo", description: "bar", address: "0x012341240193904589103940494013491358135013499" },
          ],
        },
      ],
    },
    "ERPC": {
      exec: async (page: Page) => {
        await page.waitFor(3000);
      },
      cases: [
        {
          type: "ERPC",
          data: "",
        },
      ],
    },
  } as any,
});

beforeAll(async (done) => {
  await page.goto("http://localhost:3001");
  await page.click("#connect");
  const pages = await browser.pages();
  const popup = pages[pages.length - 1];
  await popup.waitFor("#onboarding");
  await popup.type("#root_newAccount_name", "1");
  await popup.type("input[type='password']", "1");
  await popup.type("#onboarding > div > form > div > div > div > div > div.MuiGrid-root.jss3.MuiGrid-container.MuiGrid-spacing-xs-2 > div:nth-child(2) > div > div > div:nth-child(5) > div > input", "1"); //tslint:disable-line
  await popup.click("#onboarding #submit");
  await popup.waitFor("#success", { visible: true });
  await popup.close();
  done();
}, 60000);

describe("sig app", () => {
  const testPlans = applicationModel.getShortestPathPlans();
  testPlans.forEach((plan: TestPlan<any, IContext>) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          await page.goto("http://localhost:3001");
          return path.test(page);
        });
      });
    });
  });
  // it("should have full coverage", () => {
  //   return applicationModel.testCoverage();
  // });
});
