import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { IContext, rawAppMachine } from "../machines/appMachine";
import { TestPlan } from "@xstate/test/lib/types";
import { Page } from "puppeteer";
jest.setTimeout(95000);
page.setDefaultTimeout(95000);
const applicationMachine = Machine<any, any, any>(rawAppMachine);
const testApplicationMachine = applicationMachine;
const applicationModel = createModel(testApplicationMachine, {
  events: {
    "CONNECT": async (page: Page) => {
      await page.waitFor("#connect", { visible: true });
      await page.click("#connect");
      const pages = await browser.pages();
      const popup = pages[pages.length - 1];
      await popup.waitFor(1000);
      await popup.waitFor("ul li:nth-child(1) > div");
      await popup.click("ul li:nth-child(1) > div");
      await popup.waitForSelector("#submit", {
        visible: true,
        timeout: 1000,
      });
    },
    "done.invoke.fetchingChainId.sig.tools": {
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
        await popup.waitFor("#submit", { timeout: 5000 });
        await popup.click("#submit");
        await popup.waitFor("#success", { visible: true, timeout: 5000 });
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
    "error.platform.fetchingAccounts.sig.tools": {
      cases: [
        {
          type: "error.platform.fetchingAccounts.sig.tools",
          data: {
            code: 32009,
            message: "Some error",
          },
        },
      ],
    },
    "done.invoke.fetchingAccounts.sig.tools": {
      cases: [
        {
          type: "done.invoke.fetchingAccounts.sig.tools",
          data: [
            { name: "foo", description: "bar", address: "0x012341240193904589103940494013491358135013499" },
          ],
        },
      ],
    },
    "SEND": {
      cases: [
        {
          type: "SEND",
          data: "0xdeadbeef",
        },
      ],
    },
    "SIGN": {
      cases: [
        {
          type: "SIGN",
          data: "0xdeadbeef",
        },
      ],
    },
    "SIGN_TYPED_DATA": {
      cases: [
        {
          type: "SIGN_TYPED_DATA",
          data: "0xdeadbeef",
        },
      ],
    },
    "ERPC": {
      cases: [
        {
          type: "ERPC",
          data: "",
        },
      ],
    },
  } as any, //eslint-disable-line
});

beforeAll(async () => {
  await page.goto("http://localhost:3001");
  await page.waitFor("#connect", { visible: true });
  await page.click("#connect");
  await page.waitFor(1000);
  const pages = await browser.pages();
  const popup = pages[pages.length - 1];
  await popup.waitFor("#onboarding");
  await page.waitFor(1000);
  await popup.type("#root_newAccount_name", "1");
  await popup.type("[type=password]", "1");
  const confirmPasswordSelector = "div:nth-child(5) > div > input";
  await popup.type(confirmPasswordSelector, "1");
  await popup.click("#onboarding #submit");
  await popup.waitFor("#success", { visible: true });
  await popup.close();
});

describe("sig app", () => {
  const testPlans = applicationModel.getShortestPathPlans();
  testPlans.forEach((plan: TestPlan<any, IContext>) => {
    describe(plan.description, () => { //eslint-disable-line
      plan.paths.forEach((path) => {
        it(path.description, async () => { //eslint-disable-line
          return path.test(page);
        });
      });
    });
  });
  it("should have full coverage", () => {
    return applicationModel.testCoverage();
  });
});
