const normalize = require('./lib/normalize');
const format = require('./lib/format');

const metadata = function(s, o) {
  if (s["メタデータ"] === undefined) s["メタデータ"] = o;
  else if (Array.isArray(s["メタデータ"])) s["メタデータ"].push(o);
  else s["メタデータ"] = [s["メタデータ"], o];
};

const main = function(json) {
  if (json["@type"] !== '連絡先型' || json["電話番号"] === undefined) return json;

  let val = normalize(json["電話番号"]);

  if (val.indexOf("+") === 0) {
    json["電話番号"] = val;
    return json;
  }

  if (val.match(/^([0-9\+\-\(\)\,]+)$/)) {
    const head = RegExp.$1;
    try {
      json["電話番号"] = format(head.replace(/[^0-9]/g, ""));
    } catch (e) {
      json["電話番号"] = head;
      metadata(json, {
        "@type": "文書型",
        "説明": e.message
      });
    }
  } else if (val.match(/^([0-9\+\-\(\)\,]+)\(([^\)]+)\)(.*)$/)) {
    const head = RegExp.$1;
    const body = RegExp.$2;
    const tail = RegExp.$3;
    if (json["内線番号"] === undefined)
      json["内線番号"] = json["電話番号"].substring(head.length + 1, head.length + body.length + 1);
    try {
      json["電話番号"] = format(head.replace(/[^0-9]/g, ""));
    } catch (e) {
      json["電話番号"] = head;
      metadata(json, {
        "@type": "文書型",
        "説明": e.message
      });
    }
  } else {
    json["電話番号"] = val;
    metadata(json, {
      "@type": "文書型",
      "説明": "電話番号を正規化できませんでした"
    });
  }

  return json;
};

const dig = function(src) {
  if (Array.isArray(src)) return src.map(dig);
  if (typeof src !== 'object') return src;

  const dst = {};
  Object.keys(src).forEach(key => {
    dst[key] = dig(src[key]);
  });
  return main(dst);
};

module.exports = function(src, options) {
  if (typeof src === 'string') {
    return dig({
      "@context": "https://imi.go.jp/ns/core/context.jsonld",
      "@type": "連絡先型",
      "電話番号": src
    });
  }
  return dig(src);
};
