const areacode = require("./areacode.json").sort((a, b) => b.length - a.length);

module.exports = function(phone) {

  const numbers = phone.replace(/[^0-9]/, "");

  // 00から始まる番号:中継する電話会社を使って電話する時や国際電話をかける時に使います。
  if (numbers.match(/^00/)) {
    throw new Error(`00 で始まる番号は特別な番号です`);
  }

  // 電気通信番号指定状況で HEAD-CDE-TAIL となっているもの
  if (phone.match(/^(0800|0570|0990|0120|0600|020|070|080|090)([0-9]{3})([0-9]+)$/)) {
    const head = RegExp.$1;
    const body = RegExp.$2;
    const tail = RegExp.$3;
    return `${head}-${body}-${tail}`;
  }

  // 電気通信番号指定状況で HEAD-CDEF-TAIL となっているもの
  if (phone.match(/^(050)([0-9]{4})([0-9]+)$/)) {
    const head = RegExp.$1;
    const body = RegExp.$2;
    const tail = RegExp.$3;
    return `${head}-${body}-${tail}`;
  }

  /*
    // 0A0から始まる番号(Aは0以外）:携帯電話、PHS、発信者課金ポケットベル、IP電話等に電話する時に使います。
    // 主に携帯電話番号、3-4-* でフォーマットする
    if (phone.match(/^(0[1-9]0)([0-9]{4})([0-9]+)$/)) {
      const head = RegExp.$1;
      const body = RegExp.$2;
      const tail = RegExp.$3;
      return `${head}-${body}-${tail}`;
    }

    // 0AB0から始まる番号（A、Bは0以外）電話会社が提供する高度な電話サービスを利用する時などに使います。
    // 主にフリーダイヤル、4-* でフォーマットする
    if (phone.match(/^(0[1-9][1-9]0)([0-9]+)$/)) {
      const head = RegExp.$1;
      const body = RegExp.$2;
      return `${head}-${body}`;
    }*/

  // 0ABCから始まる番号（A、B、Cは0以外）固定電話に電話する時に使います。（市外通話）(0－市外局番－市内局番－加入者番号）
  // 主に一般電話番号、
  if (phone.match(/^0[1-9]{3}[0-9]+$/)) {
    phone.match(/^0([0-9]{5})([0-9]+)$/);
    const head = RegExp.$1;
    const tail = RegExp.$2;
    const code = areacode.find(a => head.indexOf(a) === 0);
    if (code) {
      const body = head.replace(code, "");
      // 市内局番は 2-9 から始まる番号である
      if (!body.match(/^[2-9][0-9]*/))
        throw new Error(`市外局番に続く番号は 2-9 で始まる番号でなければなりません`);
      return `(0${code})${body}-${tail}`;
    } else {
      throw new Error(`該当する市外局番がありません`);
    }
  }

  // 1から始まる番号	緊急性、公共性、安全性の観点から重要な時や付加サービスに使います。
  if (phone.match(/^1[0-9]*$/)) {
    throw new Error(`1 で始まる番号は特別な番号です`);
  }

  // 2～9から始まる番号	固定電話に電話する時に使います。（市内通話）
  if (phone.match(/^[2-9][0-9]*$/)) {
    throw new Error(`2-9 で始まる番号は市内通話用の番号です`);
  }


  return phone;
};
