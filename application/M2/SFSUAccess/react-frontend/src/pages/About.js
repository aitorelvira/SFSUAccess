import React from 'react';
import axios from "axios";
import {Container, Row, Col, Label} from 'reactstrap';

function About() {
    axios.get('/api/members')
        .then(response => {
        })

    return (
        <div>
            <Container>
                <Row>
                    <Col lg={{span: 8, offset: 4}}>
                        <Label><b>Software Engineering class SFSU<br/>
                            Spring 2020<br/>
                            Section 01<br/>
                            Team 02</b></Label>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <b>Our team members</b>
                </Row>
                <br/>
            </Container>
        </div>
    );
}

export default About;