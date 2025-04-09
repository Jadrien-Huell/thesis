function test(message) {

    function getMessage() {
        return message
    }

    function Hello() {
        console.log(getMessage());
    }

    return {hello: Hello, getMessage: getMessage}
}

test("this is a testing message 2").hello()