/*
 * @Author: Echooooo-zhn haonanZHONG17@outlook.com
 * @Date: 2022-07-08 13:25:29
 * @LastEditors: Echooooo-zhn haonanZHONG17@outlook.com
 * @LastEditTime: 2022-07-14 00:55:00
 * @FilePath: \Visionaries\frontend\src\component\PotentialQA.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactPlayer from 'react-player';
import DOMPurify from 'dompurify';

const PotentialQA = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    // const qaList = [
    //     { question: 'How much does it cost?', answer: 'All appointments are completely free of charge for students who are currently enrolled at UNSW.' },
    //     { question: 'Worried about sharing your concerns?', answer: 'All information we gather is completely confidential. Your personal information will not be shared with anyone without your consent, this includes your faculty or lecturers. For further information, see our privacy statement by clicking here. ' },
    //     { question: 'What can I expect if offered an appointment?', answer: 'Appointments are scheduled to last around 30 minutes. We will ask you some questions to help work out what might help. We always work with you as an individual and will always treat you with respect.', video: 'https://www.youtube.com/watch?v=e4CAXOcUHio' },
    // ];

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }


    return (
        <div>
            {props.qaList.map((data, i) => {
                return (
                    <div key={i} style={{ marginTop: '5px', width: '100%', marginBottom: '5px' }}>
                        <Accordion fullWidth expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
                            <AccordionSummary

                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${i}bh-content`}
                                id={`panel${i}bh-header`}
                            >
                                <Typography sx={{ flexShrink: 0, width: '95%' }}>
                                    Question {i}: {data.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    {data.video_url === undefined || data.video_url === '' || data.video_url === null
                                        ? <></>
                                        :
                                        <ReactPlayer
                                            //url={data.video}
                                            url={data.video_url}
                                            className='react-player'
                                            width='80%'
                                            height='300px' />}
                                    <Typography ><div className="preview" dangerouslySetInnerHTML={createMarkup(data.body)}></div> </Typography>

                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                );
            })}
        </div>
    );
}
export default PotentialQA;