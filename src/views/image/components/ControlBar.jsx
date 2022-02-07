import styles from '../styles/ControlBar.module.css'
import {Accordion, AccordionSummary} from "@f-ui/core";
import Range from "../../../components/range/Range";

export default function ControlBar() {
    return (
        <div className={styles.wrapper}>
            <Accordion>
                <AccordionSummary>
                    Brightness
                </AccordionSummary>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    Exposure
                </AccordionSummary>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    Contrast
                </AccordionSummary>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    Saturation
                </AccordionSummary>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    Compression
                </AccordionSummary>
                <Range value={1}/>
            </Accordion>
        </div>
    )
}