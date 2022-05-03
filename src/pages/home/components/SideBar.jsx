import styles from '../styles/SideBar.module.css'
import logo from "../../../static/LOGO.png";
import {Button} from "@f-ui/core";
import gitDark from "../../../static/github/dark.svg";
import gitLight from "../../../static/github/light.svg";
import PropTypes from "prop-types";
import ThemeProvider from "../../project/hooks/ThemeProvider";
import {useContext, useState} from "react";

export default function SideBar(props) {
    const theme = useContext(ThemeProvider)
    const [extended, setExtended] = useState(false)

    const {
        open, setOpen
    } = props
    return (
        <div className={styles.wrapper} data-extended={`${extended}`}>
            <div style={{width: '100%', overflow: 'hidden', height: '100%'}}>
                <div className={styles.logoWrapper} style={{justifyContent: extended ? undefined : 'center'}}>
                    <div className={styles.logo}>
                        <img src={logo} alt={'logo'}/>
                    </div>
                    {extended ?
                        <div className={styles.logoTitle}>
                            Projection Engine
                        </div>
                        :
                        null}

                </div>
                <div className={styles.block}>
                    <Button onClick={() => setOpen(0)}
                            className={styles.button}
                            variant={open === 0 ? "filled" : undefined}
                            styles={{justifyContent: !extended ? 'center' : undefined}}
                    >
                    <span
                        style={{width: '30px'}}
                        className={'material-icons-round'}>inventory_2</span>
                        {extended ? 'Projects' : undefined}
                    </Button>

                    <Button onClick={() => setOpen(1)}
                            className={styles.button}
                            variant={open === 1 ? "filled" : undefined}
                            styles={{justifyContent: !extended ? 'center' : undefined}}
                    >
                    <span
                        style={{width: '30px'}}
                        className={'material-icons-round'}>chat_bubble</span>
                        {extended ? 'Give feedback' : undefined}
                    </Button>
                    {/*<Button onClick={() => setOpen(0)}*/}
                    {/*        className={styles.button}*/}
                    {/*        variant={open === 0 ? "filled" : undefined}*/}
                    {/*        styles={{justifyContent: !extended ? 'center' : undefined}}*/}
                    {/*>*/}
                    {/*<span*/}
                    {/*    style={{width: '30px'}}*/}
                    {/*    className={'material-icons-round'}>inventory_2</span>*/}
                    {/*    {extended ? 'Projects' : undefined}*/}
                    {/*</Button>*/}
                </div>
            </div>
            <div className={styles.block} style={{transform: 'none', height: '100%', alignContent: 'flex-end'}}>
                <Button onClick={() => theme.setDark(!theme.dark)}
                        className={styles.button}
                        variant={'outlined'}
                        styles={{justifyContent: !extended ? 'center' : undefined}}
                >
                    <span style={{width: '30px'}}
                          className={'material-icons-round'}>{theme.dark ? 'dark_mode' : 'light_mode'}</span>
                    {extended ? 'Theme' : undefined}
                </Button>

                <Button onClick={() => window.open('https://github.com/projection-engine')}
                        className={styles.button}
                        styles={{justifyContent: !extended ? 'center' : undefined}}
                        variant={'outlined'}>
                    <img style={{width: '30px'}} alt={'github'}
                         src={!theme.dark ? gitDark : gitLight}/>
                    {extended ? 'GitHub' : undefined}
                </Button>

                <Button onClick={() => setExtended(!extended)}
                        styles={{justifyContent: !extended ? 'center' : undefined}}
                        className={styles.button}
                        variant={'outlined'}>
                    <span style={{width: '30px'}}
                          className={'material-icons-round'}>{extended ? 'chevron_right' : 'chevron_left'}</span>
                    {extended ? 'Hide' : undefined}
                </Button>
            </div>
        </div>

    )
}

SideBar.propTypes = {
    open: PropTypes.number,
    setOpen: PropTypes.func
}