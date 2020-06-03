const format = require("../lib/format");
const expect = require('chai').expect;
const fs = require("fs");
const spec = __dirname + "/../spec";

describe('imi-enrichment-contact#format', function() {

  describe('spec', () => {
    const json = JSON.parse(fs.readFileSync(`${spec}/004-format.json`, "UTF-8"));
    json.forEach(a => {
      it(a.name, function() {
        expect(format(a.input)).deep.equal(a.output["電話番号"]);
      });
    });
  });

  describe('異常系', function() {
    it("固定電話の市内局番が 1 ではじまる", () => {
      expect(() => format("0312345678")).to.throw();
    });
    it("固定電話の市外局番が存在しない", () => {
      expect(() => format("0945987654")).to.throw();
    });
    it("00 からはじまる国際電話や中継会社等の電話番号", () => {
      expect(() => format("001")).to.throw();
    });
    it("1 からはじまる緊急系電話番号", () => {
      expect(() => format("110")).to.throw();
    });
    it("2～9 からはじまる固定電話の市内局番", () => {
      expect(() => format("2222")).to.throw();
      expect(() => format("3333")).to.throw();
    });
  });

});
