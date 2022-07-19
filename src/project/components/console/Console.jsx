import PropTypes from "prop-types"
import React, {useEffect, useRef} from "react"
import Header from "../../../components/view/components/Header"
import styles from "./styles/Console.module.css"
import {Button, Icon} from "@f-ui/core"
import useLocalization from "../../../global/useLocalization"

export default function Console(props){
    const ref = useRef()

    useEffect(() => {
        console.pushTarget(ref.current)
        return () => console.removeTarget(ref.current)
    }, [])

    const translate = useLocalization("PROJECT", "CONSOLE")

    return (
        <>
            <Header {...props} title={translate("TITLE")} icon={"terminal"}>
                <Button
                    onClick={() => {
                        ref.current.textContent = ""
                        ref.current.lastContent = undefined
                        ref.current.lastLine = undefined
                        ref.current.looped = undefined
                    }}
                    className={styles.button}
                >
                    <Icon styles={{fontSize: "1rem"}}>
                        clear_all
                    </Icon>
                    {translate("CLEAR")}
                </Button>
            </Header>
            <div className={styles.wrapper}>
                <pre ref={ref} className={styles.console}/>
            </div>
        </>
    )
}

Console.propTypes={
    hidden: PropTypes.bool,
    switchView: PropTypes.func,
    orientation: PropTypes.string,
}