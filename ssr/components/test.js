const React = require("react")
const { useState, useEffect } = React

function TestSSRComponent() {
    
    const [number, count] = useState(0);

    useEffect(() => {
        if(number === 10) alert("You just count to 10!")
    }, [number]);

    return(
        <>
            <p className="description">It can use some hook such as "useEffect" or "useState"!</p>
            <span>{`Count: ${number}`}</span>
            <button onClick={() => count((prevNumber) => prevNumber + 1)}>Count</button>
        </>
    )
}

module.exports = TestSSRComponent