import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import './App.css';
import { geneticAlgorithm } from './algorithm/algorithm';
import { Solution } from './model/model';
import { analysePath } from './commons/helpers';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function App() {
  const classes = useStyles();
  const [populationSize, setPopulationSize] = useState<number>(50);
  const [generations, setGenerations] = useState<number>(100);

  const [crossovers, setCrossovers] = useState<number>(0);
  const [mutations, setMutations] = useState<number>(0);

  const [bestStartQuality, setBestStartQuality] = useState<number>(0);
  const [bestEndQuality, setBestEndQuality] = useState<number>(0);

  const [bestCurrentQuality, setBestCurrentQuality] = useState<number>(0);
  const [currentGeneration, setCurrentGeneration] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [startHover, setStartHover] = useState<boolean>(false);
  const [resetHover, setResetHover] = useState<boolean>(false);

  const [bestSolution, setBestSolution] = useState<Solution | null>(null);

  const onPopulationSizeChange = (e: any) => {
    const newData = e.target.value;
    setPopulationSize(+newData);
  };

  const onGenerationsNumberChange = (e: any) => {
    const newData = e.target.value;
    setGenerations(+newData);
  };

  const onStart = () => {
    if (!isRunning && !!+generations && !!+populationSize) {
      setIsRunning(true);
      setTimeout(() => {
        const result = geneticAlgorithm(populationSize, generations);
        setIsRunning(false);
        const {
          bestStartQuality,
          bestEndQuality,
          mutations,
          crossovers,
          solution,
        } = result;
        setBestStartQuality(bestStartQuality);
        setBestEndQuality(bestEndQuality);
        setMutations(mutations);
        setCrossovers(crossovers);
        setBestSolution(solution);
      }, 100);
    }
  };

  const onReset = () => {
    if (!isRunning) {
      setBestStartQuality(0);
      setBestCurrentQuality(0);
      setBestEndQuality(0);
      setCurrentGeneration(0);
      setCrossovers(0);
      setMutations(0);
      setBestSolution(null);
    }
  };

  const toggleStartHover = () => {
    setStartHover(!startHover);
  };

  const toggleResetHover = () => {
    setResetHover(!resetHover);
  };

  return (
    <div className='App'>
      <div className='container'>
        <h2>Zastosowanie algorytmu genetycznego do rozwiązania CVRP</h2>
        <form className={classes.root} noValidate autoComplete='off'>
          <TextField
            defaultValue={populationSize}
            onChange={onPopulationSizeChange}
            id='filled-basic'
            label='Rozmiar populacji'
            variant='filled'
          />
          <TextField
            defaultValue={generations}
            onChange={onGenerationsNumberChange}
            id='filled-basic'
            label='Ilość generacji'
            variant='filled'
          />
        </form>
        <div className='buttons'>
          <div
            onClick={onStart}
            id={startHover && !isRunning ? 'shadow' : undefined}
            onMouseEnter={toggleStartHover}
            onMouseLeave={toggleStartHover}
            className={
              isRunning ? 'startButtonDisabled' : 'startButtonEnabled'
            }>
            Start
          </div>
          <div
            onClick={onReset}
            id={resetHover && !isRunning ? 'shadow' : undefined}
            onMouseEnter={toggleResetHover}
            onMouseLeave={toggleResetHover}
            className={
              isRunning ? 'resetButtonDisabled' : 'resetButtonEnabled'
            }>
            Reset
          </div>
        </div>
        {(isRunning || !!bestEndQuality) && (
          <div className={'results'}>
            <div className={'parameters'}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: 'courier',
                  color: 'white',
                }}>
                {`Jakość najlepszego rozwiązania populacji P0: ${bestStartQuality}`}
              </div>
              {isRunning && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: 'courier',
                    color: 'white',
                  }}>
                  ...
                </div>
              )}
              {!!bestEndQuality && (
                <div
                  style={{
                    marginTop: 10,

                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: 'courier',
                    color: 'white',
                  }}>
                  {`Najlepsza jakość po wykonaniu algorytmu :${bestEndQuality}`}
                </div>
              )}
              {!!bestSolution && (
                <>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'courier',
                      color: 'white',
                    }}>
                    {`Najlepsze rozwiązanie :`}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'courier',
                      color: 'white',
                    }}>
                    {`* Auto nr 1 : [${bestSolution[0].map(
                      (c) => ` ${c.name} `
                    )}], zapakowano: ${analysePath(bestSolution[0]).cost}`}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'courier',
                      color: 'white',
                    }}>
                    {`* Auto nr 2 : [${bestSolution[1].map(
                      (c) => ` ${c.name} `
                    )}], zapakowano: ${analysePath(bestSolution[1]).cost}`}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'courier',
                      color: 'white',
                    }}>
                    {`* Auto nr 3 : [${bestSolution[2].map(
                      (c) => ` ${c.name} `
                    )}], zapakowano: ${analysePath(bestSolution[2]).cost}`}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'courier',
                      color: 'white',
                    }}>
                    {`* Auto nr 4 : [${bestSolution[3].map(
                      (c) => ` ${c.name} `
                    )}], zapakowano: ${analysePath(bestSolution[3]).cost}`}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: 'courier',
                      color: 'white',
                    }}>
                    {`* Auto nr 5 : [${bestSolution[4].map(
                      (c) => ` ${c.name} `
                    )}], zapakowano: ${analysePath(bestSolution[4]).cost}`}
                  </div>
                </>
              )}
            </div>
            <div className={'separator'} />
            <div className={'generations'}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: 'courier',
                  color: 'white',
                }}>
                {`Udanych krzyżowań: ${crossovers}`}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  fontFamily: 'courier',
                  color: 'white',
                }}>
                {`Udanych mutacji: ${mutations}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
