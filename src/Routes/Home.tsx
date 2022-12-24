import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utilities";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 64px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 22px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ boxphoto: string }>`
  background-image: url(${(props) => props.boxphoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  font-size: 30px;
  cursor: pointer;
  overflow: hidden;

  &:first-child {
    transform-origin: left;
  }
  &:last-child {
    transform-origin: right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

//Variantss

const rowVariants = {
  hidden: {
    x: window.innerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth + 5,
  },
};

const boxVariants = {
  start: {
    scale: 1,
    y: 0,
    transition: { duration: 0.1 },
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      duration: 0.1,
      delay: 0.5,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      duration: 0.1,
      delay: 0.5,
    },
  },
};

//Component

function Home() {
  const boxAmount = 6;
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  console.log(bigMovieMatch);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const IncreaseIndex = () => {
    if (leaving) return;
    if (data) {
      setLeaving(true);
      setIndex((index) =>
        index === Math.floor(data?.results.length / boxAmount) - 1
          ? 0
          : index + 1
      );
    }
  };
  const history = useHistory();

  const onBoxClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={IncreaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving(false)}
            >
              <Row
                variants={rowVariants}
                key={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1, type: "tween" }}
              >
                {data?.results
                  .slice(1)
                  .slice(boxAmount * index, boxAmount * index + boxAmount)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="start"
                      boxphoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => onBoxClick(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {bigMovieMatch ? (
            <AnimatePresence>
              <motion.div
                layoutId={bigMovieMatch.params.movieId}
                style={{
                  position: "absolute",
                  width: "40vw",
                  height: "80vh",
                  backgroundColor: "red",
                  top: 50,
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                }}
              ></motion.div>
            </AnimatePresence>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}
export default Home;
