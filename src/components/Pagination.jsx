import { useState } from "react";

export default function usePagination(data, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  function page(angka) {
    if (angka >= 1 && angka <= totalPages) {
      setCurrentPage(angka);
    }
  }

  return { currentItems, currentPage, totalPages, nextPage, prevPage, page };
}
