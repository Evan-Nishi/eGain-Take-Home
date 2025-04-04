import { useState, useRef, useEffect } from 'react'
import './App.css'


//just for icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import dialogRoot, { ResultNode } from './DialogTree';

import RecCard from './RecCard';


//normally, I would not implement all this in the App.jsx file, but for the demo this should be fine
function App() {

  //keeps track of chat history for display only and sets initial message
  //chatHistory[n][0] is label, either user or system for who sent, [1] is the actual text
  const [chatHistory, setChatHistory] = useState([
      ['system', 'Welcome!  I am your cutlery butler and I will be helping you choose a kitchen knife today.'],
      ['system', 'For starters, what type of application will you use your knife most for?  Prep work, general cooking, or fine details?']
  ]);


  //current place in dialog tree that is updated as it is advanced
  const [currNode, setCurrNode] = useState(dialogRoot)

  //has the flow finished?
  const [flowFinished, setFlowFinished] = useState(false)

  //another reccommendation!
  let resetTree = () => {
    setFlowFinished(false)
    setCurrNode(dialogRoot)
    setChatHistory([...chatHistory, ['system', 'Chat reset. What will you use this knife for?  Prep work, general cooking, or fine details?']])
  }

  
  //system response, add to user chat, and advance descision tree
  let systemChat = (msg) => {

    if (msg.length == 0){ //just ignore
      return
    }
      //user chat added to chat history to prevent issues with React overrwriting state
    let newChatH = [...chatHistory, ['user', msg]]
    

    //tokenize message and make lowercase
    let tokens = msg.toLowerCase().match(/\b\w+\b/g)

    //set of taken options.  OK for now to be compare by reference due to same object but kinda icky.
    let taken = new Set();
    for (let token of tokens){
      if (currNode.choices.has(token)){
        taken.add(currNode.choices.get(token))
      }
    }

    //user didn't select any valid options
    if (taken.size == 0){
      setChatHistory([...newChatH,['system', currNode.defaultMessage]])
    } else if (taken.size > 1){ //if the user triggered keywords of more than one option
      setChatHistory([...newChatH, ['system', "Please only choose one option."]])
    } else {
      //if only one path is t aken, get the single choice and advance the tree
      let newNode = taken.values().next().value

      if (newNode instanceof ResultNode){
        setChatHistory([...newChatH, ['system', 'We recommend to you the ' + newNode.name + ' knife from ' + newNode.brand + '.  Feel free to look at the card below!']])
        setCurrNode(newNode)
        setFlowFinished(true)
      } else {
        console.log("helpme")
        console.log(newNode.response)
        setChatHistory([...newChatH, ['system', newNode.response]])
        setCurrNode(newNode)
      }
    }
  }

  //just to grab input field to get val/reset
  const inputRef = useRef();

  const handleSend = () => {
    //handles when message is sent by clearing input and changeing state
    systemChat(inputRef.current.value);
    inputRef.current.value = '';
  };

  //allows enter to also submit chat
  const handleKD = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  //scrolls to bottom of chat when new msg appears
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <>
      <div className='body-container'>
        <h1>Sharp Choice🔪</h1>
        <div className='chat-window'>
          {
            //displays every previous message from chat history.  Changes style depending if by user or system.
            chatHistory.map((chat) => 
              chat[0] == 'system' ? <p className='system-chat'>{chat[1]}</p> : <p className='user-chat'>{chat[1]}</p>)
          }
          <div ref={bottomRef}></div>
        </div>


        <div className='input-container'>
          <button onClick={handleSend}>
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
          </button>
          <input ref={inputRef} type='text' onKeyDown={handleKD} disabled={flowFinished}/>
        </div>
        <button onClick={resetTree}> <b>Reset</b></button>
        <br/>
      </div>

      <>
          { //basically this only renders if the flow is finished.  If it does, it renders a card with the details of the recommendation.
            flowFinished ?
            <RecCard rec={currNode}/>: <></>
          }
        </>
    </>
  )
}

export default App
