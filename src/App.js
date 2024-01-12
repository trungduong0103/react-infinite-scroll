import React, { useCallback } from "react";
import "./styles.css";

const Box = React.forwardRef((props, ref) => {
  // console.log(`I'm the ${props.index} box!`);
  return (
    <div ref={ref} className="box-container">
      <p>I'm the {props.boxId} box!</p>
    </div>
  );
});

function buildBoxes() {
  let arr = [];

  for (let i = 0; i < 5; i++) {
    arr.push(Math.floor(Math.random() * 100000));
  }

  return arr;
}

export default function App() {
  const [boxes, setBoxes] = React.useState(buildBoxes());
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const getMoreBoxes = useCallback(() => {
    if (boxes.length === 15) {
      setHasMore(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        setBoxes((prevBox) => [...prevBox, ...buildBoxes()]);
        setLoading(false);
      }, 1500);
    }
  }, [boxes.length]);

  // intersection observer way
  const observerRef = React.useRef();
  const lastItemRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            getMoreBoxes();
          }
        },
        { root: null, threshold: 1 }
      );
      if (node) observerRef.current.observe(node);
    },
    [getMoreBoxes, hasMore, loading]
  );

  // check scroll bottom way
  const containerRef = React.useRef();
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = containerRef.current;
      if (
        scrollHeight - (clientHeight + scrollTop) < 1 &&
        hasMore &&
        !loading
      ) {
        getMoreBoxes();
      }
    }
  };

  return (
    <div className="App">
      <div
        // ref={containerRef}
        // onScroll={handleScroll}
        className="scroll-container"
      >
        {boxes.map((id, idx) => (
          <div key={id}>
            <Box
              ref={boxes.length - 1 === idx ? lastItemRef : null}
              boxId={id}
              index={idx}
            />
          </div>
        ))}
        <>{loading && <div>Loading...</div>}</>
        <>{!hasMore && <div>There are no boxes left!</div>}</>
      </div>
    </div>
  );
}
