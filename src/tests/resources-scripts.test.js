
const resourcePagePath = "http://127.0.0.1:5500/smart-campus-tutor-management-system-2024/src/resources.html";
//const resourcePagePath = "http://127.0.0.1:5500/smart-campus-tutor-management-system-2024/src/resources.html";
describe('Sanity Test', () => { 
    it('should be true ', () => {
        const sanityTemp = true;
        expect(sanityTemp).toBe(true);
      });
  });

describe("Resource Page On Launch", () =>{
    beforeAll(async () => {
        await page.goto(resourcePagePath);
      });
     
      it('should be titled "Resources"', async () => {
        await expect(page.title()).resolves.toMatch('Resources');
      });
});