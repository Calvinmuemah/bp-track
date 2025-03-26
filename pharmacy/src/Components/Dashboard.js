import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import toast from "react-hot-toast";
import { db } from "./firebase"; // Ensure Firebase is imported
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Login from "./Login";

function Dashboard() {
  const [access_token] = useState(localStorage.getItem("jwtToken"));
  const nurseId = localStorage.getItem("vetId"); // Assuming nurse ID is stored as vetId
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!nurseId) return;

    // Firestore query to listen for patient requests meant for this nurse
    const q = query(collection(db, "nurseRequests"), where("nurseId", "==", nurseId));

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(newRequests);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [nurseId]);

  // Function to handle logout
  const handleLogout = async () => {
    toast.loading("Logging Out...");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("vetId");
    window.location.href = "/";
  };

  return (
    <>
      {access_token ? (
        <div className="container-fluid vh-100 bg-light">
          {/* Top Navbar */}
          <div className="d-flex justify-content-between align-items-center p-3 shadow">
            <h3 className="text-primary fw-bold">Nurse Dashboard</h3>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="container mt-4">
            <h2 className="text-primary fw-bold mb-4">Patient BP Requests</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Email</th>
                  <th>Systolic (mmHg)</th>
                  <th>Diastolic (mmHg)</th>
                  <th>Pulse (bpm)</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request, index) => (
                    <tr key={request.id}>
                      <td>{index + 1}</td>
                      <td>{request.patientEmail}</td>
                      <td>{request.bpReading.systolic}</td>
                      <td>{request.bpReading.diastolic}</td>
                      <td>{request.bpReading.pulse}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default Dashboard;






// import React, { useState, useEffect } from "react";
// // import { db, collection, query, where, onSnapshot } from "./firebase"; // Import onSnapshot
// import "bootstrap/dist/css/bootstrap.min.css";
// import toast, { Toaster } from 'react-hot-toast';

// import Login from "./Login";

// function Dashboard() {
//   const [access_token] = useState(localStorage.getItem("jwtToken"));
//   const vetId = localStorage.getItem("vetId");
//   const [requests, setRequests] = useState([]);

//   // useEffect(() => {
//   //   if (!vetId) return;

//   //   // Firestore query with real-time listener
//   //   // const q = query(collection(db, "vet_requests"), where("vetId", "==", vetId));

//   //   // Real-time listener using onSnapshot
//   //   // const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   //   //   const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   //   //   setRequests(data); // Update state instantly
//   //   // });

//   //   // Cleanup the listener when component unmounts
//   //   // return () => unsubscribe();
//   // }, [vetId]);
//   const handlelogout = async()=>{
//     const notify=toast.loading("Logging Out...")
//     localStorage.removeItem("jwtToken")
//     // localStorage.removeItem("jwtToken")
//     window.location.href = "/"
//   }

//   return (
//     <>
//       {access_token ? (
//         <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
//           <div className="row shadow-lg rounded overflow-hidden w-100 vh-100">
//             <div className="p-5" id="farmers">
//               <div className="logout">
//               <button type="submit" className="btn btn-success" onClick={handlelogout}>Logout</button>
//               </div>
//               <h2 className="text-primary fw-bold mb-4" id="farmer">
//                 Farmers Requests
//               </h2>
//               <table className="table table-striped table-responsive">
//                 <thead>
//                   <tr>
//                     <th>Id</th>
//                     <th>Animal</th>
//                     <th>Disease</th>
//                     <th>Phone</th>
//                     <th>Username</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((request, index) => (
//                     <tr key={request.id}>
//                       <td>{index + 1}</td>
//                       <td>{request.animal}</td>
//                       <td>{request.disease}</td>
//                       <td>{request.phone_number}</td>
//                       <td>{request.username}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <Login />
//       )}
//     </>
//   );
// }

// export default Dashboard;