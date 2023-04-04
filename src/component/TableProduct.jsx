import React, { useEffect, useState } from "react";
import ApiService from "../service/apiService";

const TableProduct = () => {
  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState({
    keySearch: "",
    select: "",
    page: 1,
    limit: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const loadData = async (page) => {
    try {
      setIsLoading(true);
      const realPage = page ?? filter.page;
      const res = await ApiService.ApiListProduct({
        q: filter.keySearch.trim(),
        limit: filter.limit,
        skip: (realPage - 1) * filter.limit,
        select: filter.select,
      });
      const { total } = res;
      const newFilter = {
        ...filter,
        page: realPage,
        limit: filter.limit,
        total,
      };
      setFilter(newFilter);
      setListData(res.products);
      setIsLoading(false);
      sessionStorage.setItem("data", JSON.stringify(newFilter));
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(() => {
    if (filter.limit > 0) {
      loadData(1);
      return;
    }
    let oldFilter = sessionStorage.getItem("data");
    if (oldFilter) {
      oldFilter = JSON.parse(oldFilter);
      setFilter(oldFilter);
    } else {
      setFilter((old) => ({
        ...old,
        limit: 10,
      }));
    }
  }, [filter.limit]);
  const totalPage = Math.ceil(
    filter.total / (filter.limit === 0 ? 1 : filter.limit)
  );
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };
  const handleSearch = () => {
    loadData(1);
  };
  return (
    <>
      <div className="table-product">
        <div className="header">
          <div className="header-top">
            <h2>Table Product</h2>
            <hr />
          </div>
          <div className="header-bottom">
            <div className="title">
              <p>Search</p>
            </div>
            <div className="box-search">
              <select
                onChange={handleChange}
                name="select"
                value={filter.select}
              >
                <option value={""}>전체</option>
                <option value={"title"}>상품명</option>
                <option value={"brand"}>브랜드</option>
                <option value={"description"}>상품내용</option>
              </select>
              <input
                onChange={handleChange}
                name="keySearch"
                value={filter.keySearch}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
        <p className="total">Total: {filter.total}</p>
        <div className="main">
          {isLoading && (
            <div className="loadding">
              <span className="loader"></span>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th>상품번호</th>
                <th>상품명</th>
                <th>브랜드</th>
                <th>상품내용</th>
                <th>가격</th>
                <th>평점</th>
                <th>재고]</th>
              </tr>
            </thead>
            <tbody>
              {listData?.length > 0 ? (
                listData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + filter.limit * (filter.page - 1) + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.brand}</td>
                    <td>
                      {item.description &&
                        item.description?.slice(0, 40) + "..."}
                    </td>
                    <td>{item.price && "$" + item.price}</td>
                    <td>{item.rating}</td>
                    <td>{item.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <p>limit:</p>
            <select onChange={handleChange} name="limit" value={filter.limit}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <div className="number-page">
              <button
                disabled={filter.page === 1}
                onClick={() => loadData(filter.page - 1)}
              >
                &laquo;
              </button>
              {Array.from(new Array(totalPage ?? 0)).map((item, index) => (
                <a
                  key={index}
                  className={filter.page === index + 1 ? "active" : ""}
                  onClick={() => loadData(index + 1)}
                >
                  {index + 1}
                </a>
              ))}
              <button
                disabled={filter.page === filter.total / filter.limit}
                onClick={() => loadData(filter.page + 1)}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableProduct;
