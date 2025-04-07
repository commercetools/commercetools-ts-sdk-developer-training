import {
  _SearchQuery,
  _SearchQueryExpression,
} from '@commercetools/platform-sdk';

export class SearchQueryBuilder {
  private queryExpressions: _SearchQueryExpression[] = [];

  addExactMatch(field: string, value: string) {
    if (value) {
      this.queryExpressions.push({ exact: { field, value } });
    }
    return this;
  }

  addFullTextSearch(
    field: string,
    value: string,
    language = 'en-US',
    mustMatch = 'any',
  ) {
    if (value) {
      this.queryExpressions.push({
        fullText: { field, language, value, mustMatch },
      });
    }
    return this;
  }

  build(): _SearchQuery | undefined {
    const result = this.queryExpressions.reduce((acc, expr, index) => {
      if (index === 0) return expr;
      else if (index === 1) return { and: [acc, expr] };
      else return { and: [...(acc as { and: _SearchQuery[] })['and'], expr] };
    }, {} as _SearchQuery);

    return Object.keys(result).length ? result : undefined;
  }
}
