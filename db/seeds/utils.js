exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
    if (!created_at) return { ...otherProperties };
    return { created_at: new Date(created_at), ...otherProperties };
  };
  
  exports.createRef = (arr, key, value) => {
    return arr.reduce((ref, element) => {
      ref[element[key]] = element[value];
      return ref;
    }, {});
  };
  
  exports.formatReviews = (reviews, idLookup) => {
    return reviews.map(({ created_by, belongs_to, ...restOfReview }) => {
      const place_id = idLookup[belongs_to];
      return {
        place_id,
        author: created_by,
        ...this.convertTimestampToDate(restOfReview),
      };
    });
  };