import getSymbols from './symbols';

const getDict = (() => {
  const compare = (a: any, b: any) => a.expression.length - b.expression.length;
  const cached: any = {};
  return (operators = true) => {
    const _operators = operators.toString();

    if (!cached[_operators]) {
      const { symbols, numberToSymbol } = getSymbols(operators);
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

            if (!accum[char][position] || _string.length < accum[char][position]._string.length) {
              accum[char][position] = {
                _string,
                _symbol,
                string,
                symbol,
                expression: `(${_symbol})[${numberToSymbol(position)}]`,
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
        Object.entries(dict).reduce((accum: any, [char, info]: any) => {
          const sorted = Object.values(info).sort(compare);
          const shortest = sorted[0];
          const longest = sorted.pop();
          return { ...accum, [char]: { shortest, longest } };
        }, {}),
        numberToSymbol,
      ];
    }

    return cached[_operators];
  };
})();

const charToSymbol = (char: string, operators = true, shortest: boolean = true) => {
  const [dict, numberToSymbol] = getDict(operators);
  let found = dict[char] || dict[char.toLowerCase()];
  if (found) {
    return shortest !== false ? found.shortest : found.longest;
  }
  if (char.search(/^[0-9]$/) !== -1) {
    return { expression: `(${numberToSymbol(char)})` };
  }
  return { expression: `'${char}'` };
};

const textToCode = (input = 'dad and son', options?: any) => {
  const { newLine = true, summary = true, removeSpace = true, operators = true } = options || {};

  let lines: any = input
    .trim()
    .split('')
    .map((char, i, arr) => {
      let { expression, summary } = charToSymbol(char, operators);
      if (char.search(/[0-9]/) !== -1 && i === 0) {
        const evaluated = eval(expression);
        if (typeof evaluated !== 'string') {
          expression = `[] + ${expression}`;
        }
      }
      if (i < arr.length - 1) {
        expression += newLine ? ' + ' : ' + ';
      }
      return {
        char,
        text: !newLine || removeSpace ? expression.replace(/[ ]+/g, '').replace(/\+\+/g, '+ +') : expression,
        summary,
      };
    });

  const skipped: string[] = lines
    .filter(({ char, text }: any) => `'${char}'` === text.replace(/\s*\+\s*$/, ''))
    .map(({ char }: any) => char);

  const maxLen = Math.max(
    ...lines.map(({ text }: any, i: number) => {
      return text.length + (!removeSpace && i > 0 ? 2 : 0);
    }),
  );

  lines = lines.map(({ char, text, summary: summary_ }: any, i: number) => {
    if (newLine) {
      let text_ = (!removeSpace && i > 0 ? '  ' : '') + text;
      return (
        (summary ? text_.padEnd(maxLen + 2, ' ') + "// '" + char + "'" + (summary_ ? ` == ${summary_}` : '') : text_) +
        '\n'
      );
    }
    return text;
  });

  return {
    code:
      lines
        .map((text: any) => text)
        .join('')
        .trim() + `\n// -> '${input}'`,
    skipped,
  };
};

export { textToCode };
