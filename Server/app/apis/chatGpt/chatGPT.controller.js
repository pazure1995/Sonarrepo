const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

exports.chatGPT = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Generate a response with ChatGPT
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 2048,
    });
    res.send(completion.data.choices[0].text);
  } catch (err) {
    console.log("Error Caught", err);
    return res.status(500).send({
      message: "Some error has occurred, please try again later",
    });
  }
};
