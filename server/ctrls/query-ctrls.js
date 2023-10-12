import fetch from "node-fetch";
// vars
const QUERY_ENDPOINT = "http://127.0.0.1:8000/doubts";

export const query = async (req, res) => {
  try {
    const data = req.body;
    const result = await fetch(QUERY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    res.status(200).send(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message || "Some error occurred." });
  }
};
