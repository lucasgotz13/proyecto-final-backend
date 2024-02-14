const socket = io();
const addMessage = () => {
    const msg = {
        user: document.getElementById("user").value,
        message: document.getElementById("message").value,
    };
    socket.emit("new-message", msg);
    console.log(msg);
    return false;
};

socket.on("all-messages", (data) => {
    console.log(data);
    render(data);
});

const render = (data) => {
    const html = data
        .map(
            (elem) =>
                `<div>
            <strong>${elem.user}</strong>: <em>${elem.message}</em> 
        </div>`
        )
        .join("");
    document.getElementById("caja").innerHTML = html;
};
