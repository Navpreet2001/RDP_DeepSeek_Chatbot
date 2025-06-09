const express = require('express');
const cors = require('cors');
const app = express();
const { Ollama } = require('ollama');
const PORT = 3000;

const ollama = new Ollama({
    host: 'http://localhost:11434'
})

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//endpoint for chat stream
app.post('/api/chat-stream'), async (req, res) => {
  
    
try {

    //promptfrom the user
    
       const { prompt } = req.body;  
       
       //initialize the stream from the model
       //throws prompt from user into the model
         const stream = await ollama.chat({
              model: 'deepSeek-r1:7b',
              messages: [{ role: 'user', content: prompt }],
              stream: true
         });

res.header('Content-type', 'text/plain');



       for await (const chunk of stream) {
        try{

            //check content in eaqch chunk using null aware operator"?"
            if (chunk.message?.content) {
            //write the actual of the chunk with data to stream
                res.write(chunk.message.content);

            }

        }catch (streamError) {
             console.error('Error with stream:', $(streamError));  
            }
        }
    }

                   catch (error) {
                    res.status(500).send('Internal Server Error');

}
app.listen(PORT, ()=>{
    console.log(`Connected to port ${PORT}`);
});
}
