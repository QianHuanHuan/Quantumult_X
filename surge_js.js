/**
 * @fileoverview Example to compose HTTP reqeuest
 * and handle the response.
 *
 */

const url = "http://129.211.69.252:8877/wxbot/atMsg";
const data = {
    "content":"wr",
    "roomId":"24489066358@chatroom",
    "wxid":"wszl877495411",
    "nick":"亮哥哥"
};
const headers = {"Content-type": "application/json"};

const myRequest = {
    url: url,
    headers:headers,
    method: "POST", // Optional, default GET.
    body: JSON.stringify(data) // Optional.
};

$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body
    console.log(response.body);
    $notify("Title", "Subtitle", response.body); // Success!
}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
});
