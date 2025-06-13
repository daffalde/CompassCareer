export function Skeleton({ width, height }) {
  return (
    <>
      <span
        style={{ width: "100%", maxWidth: width, height: height }}
        className="skeleton"
      ></span>
    </>
  );
}
