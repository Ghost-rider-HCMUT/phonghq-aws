/* eslint-disable eqeqeq */
/* eslint-disable no-eval */
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isStart, setIsStart] = useState(false)
  const [complete, setComplete] = useState(false)
  const [achives, setAchives] = useState(0)
  const [questionTime, setQuestionTime] = useState(60)
  const [questionOperator, setQuestionOperator] = useState('random')
  let achive = 0

  // Component Home
  function Home() {
    const handleQuestionTime = (e) => {
      const value = e.target.value
      setQuestionTime(value)
    }

    const handleQuestionOperator = (e) => {
      const value = e.target.value
      setQuestionOperator(value)
    }

    return (
      <>
        <div className='box-mode'>
          <h2>Choose a game mode</h2>
          <div className='mode'>
            <div className='mode-time'>
              <label htmlFor='level-time'>Set time:</label>
              <select id='level-time'
                value={questionTime}
                onChange={handleQuestionTime}>
                <option value='10'>10s/question</option>
                <option value='20'>20s/question</option>
                <option value='60'>60/question</option>
                <option value='180'>180/question</option>
              </select>
            </div>
            <div className='mode-operator'>
              <label htmlFor='operator'>Set operator:</label>
              <select id='operator'
                value={questionOperator}
                onChange={handleQuestionOperator}
              >
                <option value='random'>Random</option>
                <option value='+'>Summation (+)</option>
                <option value='-'>Subtraction (-)</option>
                <option value='*'>Multiplication (*)</option>
                <option value='/'>Division (/)</option>
              </select>
            </div>


          </div>
        </div>
        <button
          type='button'
          className='start button-main'
          onClick={() => setIsStart(!isStart)}
        >Start</button>
        <div className='frame'>
        </div>
      </>
    )
  }

  // Component Complete
  function Complete() {
    let medal = 'medal'
    let note = 'note'
    let score = `Achievements: ${achives}/100`
    let notes = 'Not enough to receive a reward'
    if (achives < 60) {
      medal = 'medal'
      note = 'note medal4'
    }
    if (achives > 50) {
      medal = 'medal medal3'
    }
    if (achives > 70) {
      medal = 'medal medal2'
    }
    if (achives > 80) {
      medal = 'medal medal1'
    }
    return (
      <>
        <div className='award'>
          <h6 className='score' >{score}</h6>
          <span className={note}>{notes}</span>
          <div className={medal}></div>
        </div>
        <button
          type='button'
          className='finish button-main'
          onClick={() => {
            setIsStart(!isStart)
            setComplete(!complete)
            achive = 0
          }}
        >Finish</button>
        <div className='frame'>
        </div>
      </>
    )
  }

  // Component Game
  function Game() {
    const next = '>>'
    const [result, setResult] = useState('Correct !!')
    const [question, setQuestion] = useState(`20 ${questionOperator === 'random' ? '+' : questionOperator} 5 = `)
    const [answer, setAnswer] = useState(eval(`20 ${questionOperator === 'random' ? '+' : questionOperator} 5`))
    const [count, setCount] = useState(0)
    const [input, setInput] = useState(eval(`20 ${questionOperator === 'random' ? '+' : questionOperator} 5`))
    const [timer, setTimer] = useState(questionTime)
    const [disabled, setDisabled] = useState(true)
    const handleClick = (value) => {
      switch (value) {
        case 'C':
          if (input.length == 1) {
            setInput('0')
            return
          }
          setInput(input.slice(0, -1));
          break
        case '>>':
          if (count > 9) {
            setComplete(!complete)
            setAchives(achive)
          } else {
            let element_1 = Math.ceil(20 * Math.random())
            let element_2 = Math.ceil(20 * Math.random())
            let operator
            const operatorArr = ['+', '-', '*', '/']
            if (questionOperator === 'random') {
              operator = operatorArr[Math.floor(4 * Math.random())]
            } else {
              operator = questionOperator
            }

            if (operator === '/') {
              if (element_1 % element_2 != 0) {
                element_1 = element_2 * Math.ceil(20 * Math.random())
              }
            }
            if (operator === '-') {
              if (element_1 < element_2) {
                element_1 = element_2 + Math.ceil(50 * Math.random())
              }
            }
            let question = `${element_1} ${operator} ${element_2} =`
            setQuestion(question)
            setCount(prev => prev + 1)
            setResult('Enter the answer')
            setInput('0')
            setAnswer('')
            setTimer(questionTime)
            setDisabled(false)
          }
          break
        default:
          if (input.length > 5) {
            alert('Results are less than 5 characters')
          } else {
            setInput(input === '0' ? value : input + value)
          }

          break
      }
    }

    const handleSubmitClick = () => {
      const arrMath = question.split('=')
      setAnswer(eval(arrMath[0]))
      if (eval(arrMath[0]) != input) {
        setResult('Incorrect !')
      } else {
        setResult('Correct !!')
        achive = achive + 10
      }
      setDisabled(true)
    }

    const handleDelete = () => {
      setInput('0')
    }

    // Timer.
    useEffect(() => {
      const countTimer = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)

      const outTimer = setTimeout(() => {
        handleClick('>>')
      }, questionTime * 1000)

      return () => {
        clearInterval(countTimer)
        clearTimeout(outTimer)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count])
    const conclude = `${question} ${answer} `
    return (
      <>
        <h5 className='count'>{count == 0 ? 'Sample example' : `Question number ${count} `}</h5>
        <h6 className="result" style={{ color: result == 'Incorrect !!' ? 'red' : result === 'Correct !!' ? 'green' : 'black' }} >{result}</h6>
        <div className="calculator" id='calculator' >
          <div className='input' style={{ color: result == 'Incorrect !!' ? 'red' : result === 'Correct !!' ? 'green' : 'black' }}>
            {conclude}
          </div>
          <div className="answer">{input} <span onClick={handleDelete}>&times;</span></div>
          <div className='row'>
            <p className='achive'>{`Score: ${achive} /100`}</p>
            <span className='time'>{`Time: ${timer} s`}</span>
          </div>
          <div className="button-panel">
            <button className='item1' disabled={count === 0 ? true : false} onClick={() => handleClick('1')}>1</button>
            <button className='item2' disabled={count === 0 ? true : false} onClick={() => handleClick('2')}>2</button>
            <button className='item3' disabled={count === 0 ? true : false} onClick={() => handleClick('3')}>3</button>
            <button className='item4' disabled={count === 0 ? true : false} onClick={() => handleClick('4')}>4</button>
            <button className='item5' disabled={count === 0 ? true : false} onClick={() => handleClick('5')}>5</button>
            <button className='itemNext' onClick={() => handleClick('>>')} >{next}</button>
            <button className='item6' disabled={count === 0 ? true : false} onClick={() => handleClick('6')}>6</button>
            <button className='item7' disabled={count === 0 ? true : false} onClick={() => handleClick('7')}>7</button>
            <button className='item8' disabled={count === 0 ? true : false} onClick={() => handleClick('8')}>8</button>
            <button className='item9' disabled={count === 0 ? true : false} onClick={() => handleClick('9')}>9</button>
            <button className='item0' disabled={count === 0 ? true : false} onClick={() => handleClick('0')}>0</button>
            <button className='itemC' disabled={count === 0 ? true : false} onClick={() => handleClick('C')}>C</button>
          </div>
          <button className={count === 0 ? 'hide' : 'button-main'} type='submit' onClick={handleSubmitClick} disabled={disabled}>SUBMIT</button>
        </div>
        <div className='frame'>
        </div>
      </>

    )
  }

  return (
    <>
      {!isStart ? <Home></Home> : (complete ? <Complete></Complete> : <Game></Game>)}
    </>
  );
}

export default App;
