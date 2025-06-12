export function Pagination() {
  return (
    <>
      <div className="pagination">
        <div onClick={handlePrev} className="p-arrow">
          <img src="./pagig-arrow2.svg" alt="tanda panah pagination" />
        </div>
        <div onClick={handleNext} className="p-arrow">
          <img src="./pagig-arrow.svg" alt="tanda panah pagination" />
        </div>
      </div>
    </>
  );
}
