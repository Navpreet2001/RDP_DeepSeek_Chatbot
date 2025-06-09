//declaring global variables
let abortController = null;
let isGenerating = false;

//asynchronous function that is invoked when "send" button is pushed
async function sendMessage(){
    
    //grabbing elements of the chat window
    const inputBox = document.getElementById("input-Box");
    const chatBox = document.getElementById("chat-Box");
    const stopBtn = documentElementById("stop-btn")
    //trim removes trailing & leading whitespaces
    const prompt = inputBox.ariaValueMax.trim();

    //checking for prompt, if none we jump out of function
    if(!prompt) return;

    //check if model is generating.  if it is,we stop it
    if(isGenerating){
        stopGeneration();
    }
    //this places the prompt from the user in the chatbox
    chatBox.innerHTML += <div class="user-message">You: ${prompt}</div>;

    try {
        //create a new instance of the AbortController, which stops the function process
        abortController = new AbortController();
        //because the model is generating, the prompt has been sent to the back end
        isGenerating = true;

        //network request to the api endpoint
        const response = await fetch('http://localhost:3000/api/chat-stream', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({prompt}),
            signal: abortController.signal

        });


        //read the response with the built-in method
        const reader =  response.body.getReader();

        //create a new instance of text decoder
        const decoder = new TextDecoder();


        //create the Bot-message div element
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-message';
        boxDiv.textContent = 'Ai';
        chatBox.appendChild(botDiv);

        //iterate the process of streaming the data to the front in batches
        while(true) {
            const {done, value } = await reader.read();
            if(done) break;


            //decode bot message and send to botdiv
            botDiv.textContent += decoder.decode(value, {stream: true});

            chatBox.scrollTop = chatBox.scrollHeight;
        }

    } catch (error) {
        chatBox.innerHTML  += <div class="bot-message" style="color:red;">${error.message}</div>
    } finally {
    stopBtn.disable = true;
    isGenerating = false;
    }

}
//tied to the "reset" button and stop all model generation. Also disables the reset button
function stopGeneration(){
    if(abortController){
        abortController.abort();
    }
    isGenerating= false;
    document.getElementById('stop-btn').disable = true;
}