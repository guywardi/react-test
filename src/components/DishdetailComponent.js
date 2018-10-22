import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
         CardTitle, Breadcrumb, BreadcrumbItem,
         Button, Label, Col, Row, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

import { Link } from 'react-router-dom';
import {Loading } from './LoadingComponent';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

  function RenderDish({dish}) {
      return (
        <div className="col-12 col-md-5 m-1">
          <Card>
            <CardImg top src={dish.image} alt={dish.name} />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
          </Card>
        </div>
      );
  }

  function RenderComments({comments, addComment, dishId}) {
    if (comments != null)
        return (
          <div className="col-12 col-md-5 m-1">
            <h4>Comments</h4>
            <ul className="list-unstyled">
              {comments.map((comm) => {
                  return (
                    <li key={comm.id}>
                      <p>{comm.comment}</p>
                      <p>-- {comm.author}, {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comm.date)))}</p>
                    </li>
                  );
              })}
            </ul>
            <CommentForm dishId={dishId} addComment={addComment} />
          </div>
        );
    else
      return (
        <div></div>
      );
  }

  class CommentForm extends Component {

      constructor(props){
        super(props);

        this.toggleCommentModal = this.toggleCommentModal.bind(this);
        this.handleCommentModal = this.handleCommentModal.bind(this);

        this.state = {
            isNavOpen: false,
            isCommentModalOpen: false
        };
      }

      toggleCommentModal() {
          this.setState({
              isCommentModalOpen: !this.state.isCommentModalOpen
          })
      }

      handleCommentModal(values) {
          this.toggleCommentModal();
          console.log(values);
          this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
      }

      render() {
          return(
          <div>
            <Button outline onClick={this.toggleCommentModal}>
              <span className="fa fa-pencil fa-sm"> Submin Comment</span>
            </Button>
            <Modal isOpen={this.state.isCommentModalOpen} toggle={this.toggleCommentModal}>
                <ModalHeader  toggle={this.toggleCommentModal}>Submit Comment</ModalHeader>
                <ModalBody>
                  <LocalForm onSubmit={(values) => this.handleCommentModal(values)}>
                  <Row className="form-group">
                    <Col>
                        <Label htmlFor="rating" md={10}>Rating</Label>
                        <Control.select model=".rating" name="rating"
                              className="form-control">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                        </Control.select>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                        <Label htmlFor="author">Your Name</Label>
                        <Control.text model=".author" id="author" name="author"
                            placeholder="Your Name"
                            className="form-control"
                            validators={{
                                 minLength:minLength(3), maxLength: maxLength(15)
                            }}
                              />
                            <Errors
                               className="text-danger"
                               model=".author"
                               show="touched"
                               messages={{
                                  minLength: 'Must be greater than 2 charecters. ',
                                  maxLength: 'Must be 15 characters or less. '
                               }}
                            />
                    </Col>
                  </Row>
                  <Row className="form-group">
                      <Col>
                        <Label htmlFor="comment">Comment</Label>
                        <Control.textarea model=".comment" id="comment" name="comment"
                               rows="6"
                               className="form-control"/>
                      </Col>
                    </Row>
                          <Button type="submit" className="bg-primary" onClick={this.handleCommentModal}>
                          Submit
                          </Button>
                </LocalForm>
                </ModalBody>
            </Modal>
          </div>
      );
    }
  }

  const DishDetail = (props) => {
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if(props.errMess){
      return(
          <div className="container">
              <div className="row">
                 <h4>{props.errMess}</h4>
              </div>
          </div>
      );
    }
    else if (props.dish != null)
      return (
        <div className="container">
          <div className="row">
              <Breadcrumb>
                <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
              </Breadcrumb>
              <div className="col-12">
                <h3>{props.dish.name}</h3>
                <hr />
              </div>
          </div>
          <div className="row">
            <RenderDish dish={props.dish} />
              <RenderComments comments={props.comments}
                addComment={props.addComment}
                dishId={props.dish.id}
              />
          </div>
        </div>
      );
    else
      return (
        <div></div>
      );
  }

export default DishDetail;
