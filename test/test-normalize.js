const normalize = require("../lib/normalize");
const expect = require('chai').expect;

describe('imi-enrichment-contact#normalize', function() {
  it(`数字`, () => {
    expect(normalize("01234567890123456789")).to.equal("01234567890123456789");
    expect(normalize("０１２３４５６７８９０１２３４５６７８９")).to.equal("01234567890123456789");
    expect(normalize("〇一二三四五六七八九〇一二三四五六七八九")).to.equal("01234567890123456789");
  });
  it(`+`, () => {
    expect(normalize("++")).to.equal("++");
    expect(normalize("＋＋")).to.equal("++");
  });
  it(`-`, () => {
    // 半角マイナス
    expect(normalize("--")).to.equal("--");
    // 全角マイナス
    expect(normalize("ーー")).to.equal("--");

    // 全角ハイフン
    expect(normalize("‐‐")).to.equal("--");

    // 半角チルダ
    expect(normalize("~~")).to.equal("--");
    // 全角チルダ
    expect(normalize("～～")).to.equal("--");

    // 全角長音記号
    expect(normalize("ーー")).to.equal("--");

  });
  it(`カッコ`, () => {
    // 半角丸カッコ
    expect(normalize("()()")).to.equal("()()");
    // 全角丸カッコ
    expect(normalize("（）（）")).to.equal("()()");
    // 半角角カッコ
    expect(normalize("[][]")).to.equal("()()");
    // 全角角カッコ
    expect(normalize("［］［］")).to.equal("()()");
    // 半角波カッコ
    expect(normalize("{}{}")).to.equal("()()");
    // 全角波カッコ
    expect(normalize("｛｝｛｝")).to.equal("()()");
    // 全角隅付きカッコ
    expect(normalize("【】【】")).to.equal("()()");
    // 全角山カッコ
    expect(normalize("〈〉〈〉")).to.equal("()()");
    // 全角二重山カッコ
    expect(normalize("《》《》")).to.equal("()()");
    // 全角鉤カッコ
    expect(normalize("「」「」")).to.equal("()()");
    // 全角二重鉤カッコ
    expect(normalize("『』《》")).to.equal("()()");
  });
  it(`カンマ`, () => {
    // 半角カンマ
    expect(normalize(",,")).to.equal(",,");
    // 全角カンマ
    expect(normalize("，，")).to.equal(",,");
    // 全角句読点
    expect(normalize("、、")).to.equal(",,");
  });

});
