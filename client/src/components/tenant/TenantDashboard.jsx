import React, { useEffect, useState } from "react";
import { Container, Button, Modal, Row, Col } from "react-bootstrap";
import { FaMoneyBillWave, FaBan, FaFileUpload } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/ApiService";
import { useUnloadMessage } from "../hooks/useUnloadMessage";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("Guest");
  const [lease, setLease] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const togglePaymentModal = () => setShowPaymentModal(!showPaymentModal);
  const toggleTerminateModal = () => setShowTerminateModal(!showTerminateModal);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  useUnloadMessage(setMessage);
  useEffect(() => {
    setLoading(true);
    ApiService.fetchLeaseByTenant()
      .then((data) => {
        setLease(data);
  
        // Move setUsername here
        if (user?.username) {
          setUsername(user.username);
        }
        setLoading(false);
      })
      .catch((error) => {
        setMessage("Failed to fetch lease details.");
        setLoading(false);
      });
  }, [user]); // Add user as a dependency to useEffect
  
  if (loading) return <div>Loading lease details...</div>;
  if (message) return <div>Error fetching lease details: {message}</div>;
  
  return (
    <div>
      <Container
        fluid
        style={{
          background: 'url("/background.png") no-repeat center center',
          backgroundSize: "cover",
          color: "white",
          padding: "50px 0",
          position: "relative",
        }}
      >
        {/* msk */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 51, 102, 0.8)",
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
            Welcome, {[username]} !
          </h1>
          {/* TODO: replace with rental amount and payment due day, if tenant has a lease, otherwise, d-none */}
          <p style={{ textAlign: "center" }}>
            Your next payment of {[lease.rent_amount]} is due on {[lease.payment_due_day]}.
          </p>
        </div>
      </Container>

      <Row
        className="justify-content-center"
        style={{ marginTop: "-25px", position: "relative", zIndex: 1 }}
      >
        <Col xs="auto">
          <Button
            variant="light"
            onClick={togglePaymentModal}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaMoneyBillWave size={30} />
            <br />
            {/* replace with a placeholder -coming soon */}
            Pay
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={toggleTerminateModal}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaBan size={30} />
            <br />
            {/* Delete lease */}
            Terminate
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            onClick={toggleUploadModal}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaFileUpload size={30} />
            <br />
            Upload
          </Button>
        </Col>
      </Row>

      <Modal show={showPaymentModal} onHide={togglePaymentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Make a Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Payment details and options...</Modal.Body>
      </Modal>

      <Modal show={showTerminateModal} onHide={toggleTerminateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Terminate Lease</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirmation and implications of terminating the lease...
        </Modal.Body>
      </Modal>

      {/* TODO:Upload files  */}
      <Modal show={showUploadModal} onHide={toggleUploadModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>File upload options and instructions...</Modal.Body>
      </Modal>
    </div>
  );
};

export default TenantDashboard;
