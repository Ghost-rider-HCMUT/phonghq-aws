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
          <h2>Mời chọn chế độ chơi</h2>
          <div className='mode'>
            <div className='mode-time'>
              <label htmlFor='level-time'>Chọn thời gian:</label>
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
              <label htmlFor='operator'>Chọn phép toán:</label>
              <select id='operator'
                value={questionOperator}
                onChange={handleQuestionOperator}
              >
                <option value='random'>Ngẫu nhiên</option>
                <option value='+'>Cộng (+)</option>
                <option value='-'>Trừ (-)</option>
                <option value='*'>Nhân (*)</option>
                <option value='/'>Chia (/)</option>
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
    let score = `Thành tích: ${achives}/100`
    let notes = 'Chưa đủ để nhận thưởng'
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
    const [result, setResult] = useState('Chính xác')
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
            // if (result === 'Biểu thức chính xác') {
            //   achive = achive + 10;
            // }
            setQuestion(question)
            setCount(prev => prev + 1)
            setResult('Nhập đáp án')
            setInput('0')
            setAnswer('')
            setTimer(questionTime)
            setDisabled(false)
          }
          break
        default:
          setInput(input === '0' ? value : input + value)
          break
      }
    }

    const handleSubmitClick = () => {
      const arrMath = question.split('=')
      setAnswer(eval(arrMath[0]))
      if (eval(arrMath[0]) != input) {
        setResult('Biểu thức sai')
      } else {
        setResult('Biểu thức chính xác')
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
        <h5 className='count'>{count == 0 ? 'Ví dụ mẫu' : `Câu hỏi số ${count} `}</h5>
        <h6 className="result" style={{ color: result == 'Biểu thức sai' ? 'red' : result === 'Biểu thức chính xác' ? 'green' : 'black' }} >{result}</h6>
        <div className="calculator" id='calculator' >
          <div className='input' style={{ color: result == 'Biểu thức sai' ? 'red' : result === 'Biểu thức chính xác' ? 'green' : 'black' }}>
            {conclude}
          </div>
          <div className="answer">{input} <span onClick={handleDelete}>&times;</span></div>
          <div className='row'>
            <p className='achive'>{`Điểm: ${achive} /100`}</p>
            <span className='time'>{`Thời gian: ${timer} giây`}</span>
          </div>
          <div className="button-panel">
            <button className='item1' onClick={() => handleClick('1')}>1</button>
            <button className='item2' onClick={() => handleClick('2')}>2</button>
            <button className='item3' onClick={() => handleClick('3')}>3</button>
            <button className='item4' onClick={() => handleClick('4')}>4</button>
            <button className='item5' onClick={() => handleClick('5')}>5</button>
            <button className='itemNext next' onClick={() => handleClick('>>')} >{next}</button>
            <button className='item6' onClick={() => handleClick('6')}>6</button>
            <button className='item7' onClick={() => handleClick('7')}>7</button>
            <button className='item8' onClick={() => handleClick('8')}>8</button>
            <button className='item9' onClick={() => handleClick('9')}>9</button>
            <button className='item0' onClick={() => handleClick('0')}>0</button>
            <button className='itemC' onClick={() => handleClick('C')}>C</button>
          </div>
          <button className='button-main' type='submit' onClick={handleSubmitClick} disabled={disabled}>SUBMIT</button>
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
