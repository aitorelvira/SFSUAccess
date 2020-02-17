import React from 'react';
import { Container, Row, Col, Label } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import JunMinLi from './JunMinLi';
import './css/About.css';

const About = () => {
  return (
    <Container>
      <Row>
        <Col lg={{ span: 8, offset: 4 }}>
          <Label><b>Software Engineering class SFSU<br/>
             Spring 2020<br/>
             Section 01<br/>
             Team 02</b></Label>
        </Col>
      </Row><hr/>
      <Row>
          <b>Our team members</b>
      </Row>
      <br/>
      <Row>
          <Link to="/KevinLuong">
            <Button variant = "secondary">
                Kevin Luong
            </Button>
        </Link>
     </Row>
     <Row>
          <Link to="/JunMinLi">
            <Button variant = "secondary">
                JunMinLi
            </Button>
        </Link>
     </Row>
     <Row>
          <Link to="/JunMinLi">
            <Button variant = "secondary">
                member
            </Button>
        </Link>
     </Row>
     <Row>
          <Link to="/JunMinLi">
            <Button variant = "secondary">
                member
            </Button>
        </Link>
     </Row>
     <Row>
          <Link to="/JunMinLi">
            <Button variant = "secondary">
                member
            </Button>
        </Link>
     </Row>
     <Row>
          <Link to="/JunMinLi">
            <Button variant = "secondary">
                member
            </Button>
        </Link>
     </Row>
     
      <Switch>
        <Route exact path="/JunMinLi" component={JunMinLi} />
      </Switch>
    </Container>
    );
};
const mapStateToProps = state => ({

  isLoggedIn: state.userReducer.isLoggedIn,

})
export default connect(mapStateToProps)(About);