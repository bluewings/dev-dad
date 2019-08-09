import getSymbols, { UNESCAPE_FUNCTION } from './symbols';

const toChunk = (text: string) =>
  Array.from(text.normalize()).reduce((accum: string[], curr: string) => {
    const prev = accum.slice(-1)[0];
    return prev && prev !== '0' && prev.search(/[^0-9]/) === -1 && curr.search(/[0-9]/) !== -1
      ? [...accum.slice(0, accum.length - 1), prev + curr]
      : [...accum, curr];
  }, []);

const getDict = (() => {
  const compare = (a: any, b: any) => a.expression.length - b.expression.length;
  const cached: any = {};
  return (operators = true) => {
    const _operators = operators.toString();

    if (!cached[_operators]) {
      const { symbols, chars, numberToSymbol } = getSymbols(operators);
      let dict = symbols
        .map((symbol) => ({
          symbol,
          string: `${(symbol === '{}' ? {} : eval(symbol)) + ''}`,
        }))
        // add symbol + symbol patterns.
        .reduce(
          (accum: any, { symbol, string }: any, i: number, symbols: any) => [
            ...accum,
            ...symbols.map((e: any, j: number) =>
              i === j
                ? { string: [string], symbol: [symbol] }
                : { string: [string, e.string], symbol: [symbol, e.symbol] },
            ),
          ],
          [],
        )
        // to char dictionary
        .reduce((accum: any, e: any) => {
          let { symbol, string } = e;
          [...string.join('')].forEach((char, position) => {
            if (!accum[char]) {
              accum[char] = {};
            }
            if (symbol[0] === '{}') {
              symbol[0] = '[] + {}';
            }
            let _symbol = symbol.join(' + ');
            const _string = string.join('');
            if (eval(_symbol) !== _string) {
              const [first, ...rest] = symbol;
              _symbol = [`${first} + []`, ...rest].join(' + ');
            }

            const expression = `(${_symbol})[${numberToSymbol(position)}]`;
            if (!accum[char][position] || expression.length < accum[char][position].expression.length) {
              accum[char][position] = {
                _string,
                _symbol,
                string,
                symbol,
                expression,
                summary: `${string
                  .map((f: any) => `'${f}'`)
                  .join(' + ')
                  .replace(/^(.* \+ .*)$/, '($1)')}[${position}]`,
              };
            }
          });
          return accum;
        }, {});

      // find shortest, longest
      cached[_operators] = [
        Object.entries(dict).reduce(
          (accum: any, [char, info]: any) => {
            const sorted = Object.values(info).sort(compare);
            const shortest = sorted[0];
            const longest = sorted.pop();
            return { ...accum, [char]: { shortest, longest } };
          },
          Object.entries(chars).reduce((accum, [char, expression]) => {
            return {
              ...accum,
              [char]: { shortest: { expression } },
            };
          }, {}),
        ),
        numberToSymbol,
      ];
    }
    return cached[_operators];
  };
})();

const charToSymbol = (char: string, operators = true, shortest: boolean = true) => {
  const [dict, numberToSymbol] = getDict(operators);
  let found = dict[char];
  if (found) {
    return shortest !== false ? found.shortest : found.longest;
  }
  if (char.search(/^[0-9]+$/) !== -1) {
    return { expression: `(${numberToSymbol(char)})` };
  }
  // this will be processed later. (final stage)
  return { expression: `__${char}--` };
};

const _textToCode = (input = 'dad and son', options?: any) => {
  const { newLine = true, summary = true, removeSpace = true, operators = true, resultComment = true } = options || {};

  let lines: any = toChunk(input.trim()).map((char, i, arr) => {
    let _expression = '';
    let _summary = '';
    let { expression, summary } = charToSymbol(char, operators);
    _expression = expression;
    _summary = summary;
    if (char.search(/[0-9]/) !== -1 && i === 0) {
      const evaluated = eval(_expression);
      if (typeof evaluated !== 'string') {
        _expression = `[] + ${_expression}`;
      }
    }
    if (i < arr.length - 1) {
      _expression += newLine ? ' + ' : ' + ';
    }
    return {
      char,
      text: !newLine || removeSpace ? _expression.replace(/[ ]+/g, '').replace(/\+\+/g, '+ +') : _expression,
      summary: _summary,
    };
  });

  const skipped: string[] = lines
    .filter(({ char, text }: any) => `'${char}'` === text.replace(/\s*\+\s*$/, ''))
    .map(({ char }: any) => char);

  const PROVIDE_SUMMARY_LIMIT = 80;

  const maxLen = Math.max(
    ...lines
      .filter(({ text }: any) => text.length <= PROVIDE_SUMMARY_LIMIT)
      .map(({ text }: any, i: number) => {
        return text.length + (!removeSpace && i > 0 ? 2 : 0);
      }),
  );

  lines = lines.map(({ char, text, summary: summary_ }: any, i: number) => {
    if (newLine) {
      let text_ = (!removeSpace && i > 0 ? '  ' : '') + text;
      return (
        (text.length <= PROVIDE_SUMMARY_LIMIT && summary && text.search(/__/) === -1
          ? text_.padEnd(maxLen + 2, ' ') + "// '" + char + "'" + (summary_ ? ` == ${summary_}` : '')
          : text_) + '\n'
      );
    }
    return text;
  });

  const merged = lines
    .map((text: any) => text)
    .join('')
    .trim();
  let _input = input;
  try {
    _input = eval(merged);
  } catch (err) {
    /* ignore */
  }
  return {
    code: `${merged}${resultComment ? `\n// -> '${_input}'` : ''}`,
    skipped,
  };
};

const textToCode = (() => {
  const cached: any = {};
  return (input = 'dad and son', options?: any) => {
    let code = _textToCode(input, options).code;
    code = code.replace(/__(.*?)--/g, (whole, p1) => {
      if (p1 && !cached[p1]) {
        let escaped = escape(p1);
        if (escaped === p1) {
          escaped = '%' + p1.charCodeAt(0).toString(16);
        }
        escaped = _textToCode(escaped.toLowerCase(), {
          newLine: false,
          summary: false,
          removeSpace: true,
          operators: false,
          resultComment: false,
        }).code;
        cached[p1] = `(${UNESCAPE_FUNCTION}(${escaped}))`;
      }
      return cached[p1] || '';
    });

    return { code };
  };
})();

export { textToCode };
