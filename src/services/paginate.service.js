const paginate = async (data, page, limit) => {
  try {
    const count = data.length;
    if (!limit || !page) {
      page = 1;
      limit = count;
    }
    const totalPage = Math.ceil(count / limit);
    if (page > totalPage) page = totalPage;
    if (page <= 0) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = data.slice(startIndex, endIndex);
    return { count: count, currentPage: page, totalPage: totalPage, paginatedData: paginatedData };
    // return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = paginate;
