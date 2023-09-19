

const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const express = require("express");
const serviceAccount = require("./keyandperms.json");
initializeApp({credential: cert(serviceAccount)});

const db = getFirestore();

const app = express();
const cors = require("cors");
app.use(cors({origin: true}));
const value = Math.floor(Math.random()*2251)*1000;


app.get("/hello", (req, res) => {
  return res.status(200).send("Hello from Firebase!");
});

app.post("/addpharmacy/:pharmacyID", async (req, res) => {
  const mid =req.params.pharmacyID;
  await db.collection("pharmacies").doc(mid).set({
    pharmacyName: req.body.pharmacyName,
    pharmacyLocation: req.body.pharmacyLocation,
    telephone: req.body.telephone,
    username: req.body.username,
    email: req.body.email,
    pharmacyType: req.body.pharmacyType,
    pharmacyID: mid,
  }).then((value) => {
    res.status(500).send({msg: "Pharmacy profile created successfully"});
  }).catch((err) => {
    res.status(500).send({error: err});
  });
});


app.get("/getpharmacy/:pharmacyID", async (req, res) => {
  try {
    const pharmRef = db.collection("pharmacies").doc(req.params.pharmacyID);
    const doc = await pharmRef.get();
    let profile = {};
    if (!doc.exists) {
      console.log("No profile found");
    } else {
      profile = {
        pharmacyName: doc.data().pharmacyName,
        pharmacyLocation: doc.data().pharmacyLocation,
        email: doc.data().email,
        telephone: doc.data().telephone,
        pharmacyType: doc.data().pharmacyType,
        pharmacyID: doc.data().pharmacyID,
      };
    }
    return res.status(200).send({msg: "OK", data: profile});
  } catch (e) {
    return res.status(500).send({msg: e});
  }
});


app.put("/updatepharmacy/:pharmacyID", async (req, res) => {

});


app.post("/addpatient/:pharmacyID", async (req, res) => {
  const id = `PA${value}`;
  await db.collection("patients").doc(id).set({
    fullName: req.body.fullName,
    pNumber: req.body.pNumber,
    pEmail: req.body.pEmail,
    homeAddress: req.body.homeAddress,
    pAge: req.body.pAge,
    birthday: req.body.birthday,
    patientID: id,
    deviceID: req.body.deviceID,
    pType: req.body.pType,
    allergies: req.body.allergies,
    bloodGroup: req.body.bloodGroup,
    healthCondition: req.body.healthCondition,
    conditionType: req.body.conditionType,
    medicalDoc: req.body.medicalDoc,
    pharmacyID: req.params.pharmacyID,
    keys: [id, req.body.pEmail, req.body.fullName,
      req.body.pAge, req.body.pNumber],
  }).then((value) => {
    res.status(500).send({msg: "Patient profile created successfully"});
  }).catch((err) => {
    res.status(500).send({error: err});
  });
});

app.post("/updatePatient/:patientId", async (req, res) => {
  await db.collection("patients").doc(req.params.patientId).update({
    fullName: req.body.fullName,
    pNumber: req.body.pNumber,
    pEmail: req.body.pEmail,
    homeAddress: req.body.homeAddress,
    pAge: req.body.pAge,
    birthday: req.body.birthday,
    deviceID: req.body.deviceID,
    pType: req.body.pType,
    allergies: req.body.allergies,
    bloodGroup: req.body.bloodGroup,
    healthCondition: req.body.healthCondition,
    conditionType: req.body.conditionType,
    medicalDoc: req.body.medicalDoc,
    pharmacyID: req.params.pharmacyID,
    keys: [req.body.pEmail, req.body.fullName,
      req.body.pAge, req.body.pNumber],
  }).then((value) => {
    res.status(500).send({msg: "Patient profile updated successfully"});
  }).catch((err) => {
    res.status(500).send({error: err});
  });
});

app.get("/getAllPatients", async (req, res) => {
  try {
    const pRef = db.collection("patients");
    const docs = await pRef.get();
    const p = [];
    docs.forEach((d)=>{
      const sortedpatient = {
        fullName: d.data().fullName,
        pNumber: d.data().pNumber,
        pEmail: d.data().pEmail,
        homeAddress: d.data().homeAddress,
        pAge: d.data().pAge,
        birthday: d.data().birthday,
        patientID: d.id,
        deviceID: d.data().deviceID,
        pType: d.data().pType,
        allergies: d.data().allergies,
        bloodGroup: d.data().bloodGroup,
        healthCondition: d.data().healthCondition,
        conditionType: d.data().conditionType,
        medicalDoc: d.data().medicalDoc,
        pharmacyID: d.data().pharmacyID,
      };
      p.push(sortedpatient);
    },
    );
    return res.status(200).send({msg: "ok", data: p});
  } catch (err) {
    res.status(500).send({error: err});
  }
});

app.get("/getpatient/:patientID", async (req, res) => {
  try {
    const patient = db.collection("patients").doc(req.params.patientID);
    const d = await patient.get();
    let doc = {};

    if (d.exists()) {
      doc = {
        fullName: d.data().fullName,
        pNumber: d.data().pNumber,
        pEmail: d.data().pEmail,
        homeAddress: d.data().homeAddress,
        pAge: d.data().pAge,
        birthday: d.data().birthday,
        patientID: d.id,
        deviceID: d.data().deviceID,
        pType: d.data().pType,
        allergies: d.data().allergies,
        bloodGroup: d.data().bloodGroup,
        healthCondition: d.data().healthCondition,
        conditionType: d.data().conditionType,
        medicalDoc: d.data().medicalDoc,
        pharmacyID: d.data().pharmacyID,
      };
    } else {
      console.log("No patient found");
    }
    return res.status(200).send(doc);
  } catch (err) {
    return res.status(500).send({error: err});
  }
});

app.get("/searchPatients/:term", async (req, res) => {
  try {
    const pRef = db.collection("patients");
    const docs = pRef.where("keys", "array-contains",
        req.params.term).get();
    const p = [];
    docs.forEach((d)=>{
      const sortedpatient = {
        fullName: d.data().fullName,
        pNumber: d.data().pNumber,
        pEmail: d.data().pEmail,
        homeAddress: d.data().homeAddress,
        pAge: d.data().pAge,
        birthday: d.data().birthday,
        patientID: d.id,
        deviceID: d.data().deviceID,
        pType: d.data().pType,
        allergies: d.data().allergies,
        bloodGroup: d.data().bloodGroup,
        healthCondition: d.data().healthCondition,
        conditionType: d.data().conditionType,
        medicalDoc: d.data().medicalDoc,
        pharmacyID: d.data().pharmacyID,
      };
      p.push(sortedpatient);
    },
    );
    return res.status(200).send({msg: "ok", data: p});
  } catch (err) {
    res.status(500).send({error: err});
  }
});

app.get("/deletePatient/:patientID", async (req, res) => {
  await db.collection("patients").doc(req.params.patientID).delete().then(
      (value)=>{
        return res.status(200).send({msg: "Patient deleted"});
      }).catch((err) =>{
    return res.status(200).send({msg: err});
  });
});

//
app.post("/addresults/:pharmacyID", async (req, res) => {
  await db.collection("rapidtests").add({
    testkitName: req.body.testkitName,
    pharmacyName: req.body.pharmacyName,
    testdate: req.body.testdate,
    testtime: req.body.testtime,
    testTakenBy: req.body.testTakenBy,
    testBill: req.body.testBill,
    phoneNumber: req.body.phoneNumber,
    patientName: req.body.patientName,
    testoutcome: req.body.testoutcome,
    patientID: req.body.patientID,
    pharmacyID: req.params.pharmacyID,
  }).then((val)=> {
    return res.status(200).send({msg: "test results added"});
  }).catch((err)=>{
    return res.status(500).send({
      "msg": err.message,
    });
  });
});

app.get("/getResult/:patientID", async (req, res) => {
  const d = await db.collection("rapidtests").where("patientName", "==",
      req.params.patientID).get().catch((err) => {});
  let doc = {};
  if (d.exists()) {
    doc = {
      testkitName: d.data().testkitName,
      pharmacyName: d.data().pharmacyName,
      testdate: d.data().testdate,
      testtime: d.data().testtime,
      testTakenBy: d.data().testTakenBy,
      testBill: d.data().testBill,
      phoneNumber: d.data().phoneNumber,
      patientName: d.data().patientName,
      testoutcome: d.data().testOutcome,
      patientID: d.data().patientID,
      pharmacyID: d.data().pharmacyID,
      id: d.id,
    };
  } else {
    console.log("No result found");
    return res.status(500).send({});
  }
  return res.status(200).send(doc);
});

app.get("/deletetestresult/:patientID", async (req, res) => {
  await db.collection("patients").doc(req.params.patientID).delete().then(
      (value)=>{
        return res.status(200).send({msg: "Patient deleted"});
      }).catch((err) =>{
    return res.status(200).send({msg: err});
  });
});

app.post("/addkit/:pharmacyID", async (req, res) => {
  const doc = await db.collection("testkits").add({
    testkitName: req.body.testkitName,
    testkitbrand: req.body.testkitbrand,
    quantity: req.body.quantity,
    typeoftest: req.body.typeoftest,
    pharmacyId: req.params.pharmacyId,
  }).then((val)=> {
    return res.status(200).send({msg: "test kit added"});
  }).catch((err)=>{
    return res.status(500).send({
      "msg": err.message,
    });
  });
});

exports.medbox = onRequest(app);
