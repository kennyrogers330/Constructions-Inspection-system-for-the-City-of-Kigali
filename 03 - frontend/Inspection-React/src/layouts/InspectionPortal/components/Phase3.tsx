import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import AddReportRequest from "../../../models/AddReportRequest";
import InspectorReviewRequestModel from "../../../models/InspectorReviewRequestModel";
import { LeaveAReview } from "../../Utils/LeaveAReview";
import { StarsReview } from "../../Utils/StarsReview";
import React from 'react';
import { Redirect, useHistory } from "react-router-dom";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const Phase3: React.FC<{projectId: string, phase: number}> = (props) =>{

    const { authState } = useOktaAuth();
        
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [email , setEmail] = useState('');
    const [projectName , setprojectName] = useState('');
    const [projectType, setProjectType] = useState('');


    // Site Preparation
    const [siteClearing, setSiteClearing] = useState('');
    const [environmentalCompliance, setEnvironmentalCompliance] = useState('');
    const [erosionControl, setErosionControl] = useState('');
    const [sedimentationControl, setSedimentationControl] = useState('');

    //Review And Comments

    const [starInput, setStarInput] = useState(0);
    const [displayInput, setDisplayInput] = useState(false);
    const [reviewDescription, setReviewDescription] = useState('');
    
    const [recipients, setRecipients] = useState<string[]>([]);
    const [inspectorName, setInspectorName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [inspectorEmail , setInspectorEmail] = useState(authState?.accessToken?.claims.sub);
    
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const [PavementCondition, setPavementCondition] = useState('');
    const [pavementConditionWeight, setPavementConditionWeight] = useState(0);

    const [RoadMarkings, setRoadMarkings] = useState('');
    const [RoadMarkingsWeight, setRoadMarkingsWeight] = useState(0);

    const [RoadsideVegetation, setRoadsideVegetation] = useState('');
    const [RoadsideVegetationWeight, setRoadsideVegetationWeight] = useState(0);

    const [DrainageSystem, setDrainageSystem] = useState('');
    const [DrainageSystemWeight, setDrainageSystemWeight] = useState(0);
    
    const [CracksandPotholes, setCracksandPotholes] = useState('');
    const [CracksandPotholesWeight, setCracksandPotholesWeight] = useState(0);
    
    const [SurfaceSmoothness, setSurfaceSmoothness] = useState('');
    const [SurfaceSmoothnessWeight, setSurfaceSmoothnessWeight] = useState(0);
    
    const [Rutting, setRutting] = useState('');
    const [RuttingWeight, setRuttingWeight] = useState(0);

    const [EdgeCondition, setEdgeCondition] = useState('');
    const [EdgeConditionWeight, setEdgeConditionWeight] = useState(0);    

    const [TrafficLightsFunctionality, setTrafficLightsFunctionality] = useState('');
    const [TrafficLightsFunctionalityWeight, setTrafficLightsFunctionalityWeight] = useState(0);   

    const [TrafficSignal, setTrafficSignal] = useState('');
    const [TrafficSignalWeight, setTrafficSignalWeight] = useState(0); 
    
    const [PedestrianCrossings, setPedestrianCrossings] = useState('');
    const [PedestrianCrossingsWeight, setPedestrianCrossingsWeight] = useState(0); 

    const [ExcavationCompletion, setExcavationCompletion] = useState('');
    const [ExcavationCompletionWeight, setExcavationCompletionWeight] = useState(0);

    const [FoundationStability, setFoundationStability] = useState('');
    const [FoundationStabilityWeight, setFoundationStabilityWeight] = useState(0);

    const [MaterialQuality, setMaterialQuality] = useState('');
    const [MaterialQualityWeight, setMaterialQualityWeight] = useState(0);
    
    const [EquipmentUtilization, setEquipmentUtilization] = useState('');
    const [EquipmentUtilizationWeight, setEquipmentUtilizationWeight] = useState(0);

    const [WorkforceProductivity, setWorkforceProductivity] = useState('');
    const [WorkforceProductivityWeight, setWorkforceProductivityWeight] = useState(0);

    const [WaterSupply, setWaterSupply] = useState('');
    const [WaterSupplyWeight, setWaterSupplyWeight] = useState(0);

    const [BedRocks, setBedRocks] = useState('');
    const [BedRocksWeight, setBedRocksWeight] = useState(0);

    const [ClimateFavorability, setClimateFavorability] = useState('');
    const [ClimateFavorabilityWeight, setClimateFavorabilityWeight] = useState(0);

    const [selectedImages, setSelectedImages] = useState<Array<any>>([]);    
    const [base64Images, setbase64Images] = useState<Array<any>>([]);
    const [base64Report, setBase64Report] = useState<any>(null);

    const history = useHistory();

    const handleAddRecipient = () => {
        setRecipients([...recipients, ""]);
    };

    const handleExportExcel = (formData: FormData) => {
        //const data = new InspectorReviewModel(23, "df", "dfv", 2, "DFd");

        const data: any = {};

        formData.forEach((value, key) => {
            data[key] = value;
                  });
    
        const worksheet = XLSX.utils.json_to_sheet([data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'data.xlsx');
    
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          if (event && event.target && event.target.result) {
            const base64String = event.target.result;
            // Use the base64String here or send it to the Spring Boot API
            setBase64Report(base64String);
            //console.log(base64String);
          }
        };
        fileReader.readAsDataURL(blob);   
            
      };
    

    async function base64ConversionForImages(e: any){
        
        if(e.target.files){
            const files = Array.from(e.target.files);

            if(files.length + selectedImages.length > 10){
                alert('The Maximum image limit which is 10 images was exceeded!');
                return;
            }
            for (let i = 0; i<files.length; i++){
                getBase64(e.target.files[i]);
            }          

            setSelectedImages((prev: any[])=> [...prev, ...files]);           
        }
    }

    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setbase64Images((prev: any[])=> [...prev, reader.result]);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }


    const handleRecipientChange = (index: number, value: string) => {
        const updatedRecipients = [...recipients];
        updatedRecipients[index] = value;
        setRecipients(updatedRecipients)
        //console.log(updatedRecipients);
    }

    const generatePDF = async () => {
        const reportContainer = document.querySelector('.report-container') as HTMLElement;
      
        if (reportContainer) {
          const canvas = await html2canvas(reportContainer);
          const imgData = canvas.toDataURL('image/png');
      
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
          pdf.save('report.pdf');
        }
      };

    const report_redirect2 = (percentageProgress: number, formData: FormData) => {
        const modelAttributes = {
            attribute1: percentageProgress,
            inspectionDate : formData.get("Inspection Date"),
            projectId: formData.get("ProjectId"),
            projectName : formData.get("ProjectName"),           
            projectType: formData.get("ProjectType"),
            inspectorName: formData.get("InspectorName"),
            PhoneNumber: formData.get("PhoneNumber"),
            reviewDescription: formData.get("reviewDescription")
        }; 

        history.push('/report', { modelAttributes}); 
    };

    const report_redirect = async (formData: FormData) => {
        // const history = useHistory();
        const formDataJson = {};
        
        const formDataArray = Array.from(formData.entries());
        const formDataObject = Object.fromEntries(formDataArray);

        history.push('/report', { formDataObject });
      };

    async function submitInspectionReport(){

        const url = `http://localhost:8080/api/admin/secure/add/report`;

            if(authState?.isAuthenticated 
                // && projectName !== '' && projectType !== '' && props.projectId !== '' && recipients.length===0 && inspectorName!== '' && PhoneNumber!== '' &&  PavementCondition != ''
                // && RoadMarkings !== '' && RoadsideVegetation !== '' && DrainageSystem !== '' && CracksandPotholes !== '' && SurfaceSmoothness !== '' && Rutting !== ''
                // && EdgeCondition !== '' && ExcavationCompletion !== '' && FoundationStability !== '' && MaterialQuality !== '' && EquipmentUtilization !== '' && WorkforceProductivity !== ''
                // && WaterSupply !== '' && BedRocks !== '' &&  ClimateFavorability !== ''
            ){
                recipients.push(email);
               // console.log(recipients);
                const formData = new FormData();
                formData.append("Inspection Date", new Date().toString());
                formData.append("ProjectId", props.projectId);
                formData.append("ProjectName", projectName);
                formData.append("ProjectType", projectType);
                formData.append("InspectorName", inspectorName);
                formData.append("PhoneNumber", PhoneNumber);
                formData.append("reviewDescription", reviewDescription);

                // handleExportExcel(formData);   
              
              const report: AddReportRequest = new AddReportRequest(props.projectId, projectName, projectType, new Date(), recipients, inspectorName, PhoneNumber);

              report.images = base64Images;
              report.inspectorEmail = inspectorEmail; 
              report.comment = reviewDescription
              
            //console.log(report);
            
            // Calculate the total possible weighted value
            const totalPossibleWeight = 10 * 21; // Assuming each metric has a maximum weight of 10

            // Calculate the sum of the weighted values of selected options
            const sumOfWeightedValues = pavementConditionWeight + RoadMarkingsWeight + RoadsideVegetationWeight + DrainageSystemWeight + CracksandPotholesWeight +
            SurfaceSmoothnessWeight + RuttingWeight + EdgeConditionWeight + ExcavationCompletionWeight + FoundationStabilityWeight + MaterialQualityWeight
            + EquipmentUtilizationWeight + WorkforceProductivityWeight + WaterSupplyWeight + BedRocksWeight + ClimateFavorabilityWeight + starInput; // Add other metric weights

            // Calculate the percentage progress
            const percentageProgress = (sumOfWeightedValues / totalPossibleWeight) * 100;

            console.log("Percentage Progress:", percentageProgress);

            formData.append("Percentage Progress", percentageProgress+"");
            report.progress = percentageProgress
            report.phase = 1
            const data: any = {};

                formData.forEach((value, key) => {
                    data[key] = value;
                        });
            
                const worksheet = XLSX.utils.json_to_sheet([data]);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
               // saveAs(blob, 'data.xlsx');
            
                const fileReader = new FileReader();
                fileReader.onload = async function(event) {
                if (event && event.target && event.target.result) {
                    const base64Report = event.target.result as string;                    
                    report.excel = base64Report;                               

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(report)
                };

                const submitNewReportResponse = await fetch(url, requestOptions);
                if(!submitNewReportResponse.ok){
                    throw new Error('Something went wrong!');
                }
                setPavementCondition('');
                setRoadMarkings('');
                setRoadsideVegetation('');
                setDrainageSystem('');
                setCracksandPotholes('');
                setSurfaceSmoothness('');
                setRutting('');
                setEdgeCondition('');
                setTrafficLightsFunctionality('');
                setTrafficSignal('');
                setPedestrianCrossings('');
                setSelectedImages([]);
                setbase64Images([]);
                setBase64Report(null);
                setDisplayWarning(false);
                setDisplaySuccess(true);
                setPhoneNumber('');
                setInspectorName('');
                setStarInput(0); 
                setReviewDescription('');                
                setRecipients([]);
                window.scrollTo(0, 0); 
                
            }else{
                alert('There is an issue with the excel report')
            }
            };
            fileReader.readAsDataURL(blob); 

            report_redirect2(percentageProgress, formData);

        }else{            
            setDisplayWarning(true);            
            setDisplaySuccess(false);
            window.scrollTo(0, 0);      
        }
    }

    
    useEffect(()=> {
        const fetchProject = async () => {
            const baseUrl: string = `http://localhost:8080/api/projects/${props.projectId}`;
            const response = await fetch(baseUrl);
            if(!response.ok){
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            setEmail(responseJson.contact_email);
            setprojectName(responseJson.title);
            setProjectType(responseJson.project_type);
            setIsLoading(false);            
        };
        fetchProject().catch((error: any)=> {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [props.projectId]);

    
    async function submitReview(starInput: number, reviewDescription: string){                
        const inspectorReviewRequest = new InspectorReviewRequestModel(starInput, parseInt(props.projectId), reviewDescription);
        console.log(inspectorReviewRequest);
        const url = `http://localhost:8080/api/reviews/secure/post`;
        const requestOptions = {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
              'Content-Type' : 'application/json'
          },
          body: JSON.stringify(inspectorReviewRequest)
       };
       const returnResponse = await fetch(url, requestOptions);
       
       if(!returnResponse.ok){
        throw new Error('Something went wrong!');
       }
       
    };

    function startValue(value: number){
        setStarInput(value);
        setDisplayInput(true);
    }

    if(isLoading){
        return(
            <SpinnerLoading/>
        )
    }
    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const handlePavementConditionChange = (selectedValue: string) => {
        if(selectedValue !== ""){
        const [value, tail] = selectedValue.split('(');
        const [weight] = tail.split(')');
        setPavementCondition(value);
        setPavementConditionWeight(parseFloat(weight)); // Parse the weight string as a float
        console.log("PavementCondition");
        console.log(value + " == "+ weight);
        }else{
            setPavementCondition('');
            setPavementConditionWeight(0);        
        }
    };

    //

    const handleRoadMarkingsChange = (selectedValue: string) => {
        if(selectedValue !== ""){
        const [value, tail] = selectedValue.split('(');
        const [weight] = tail.split(')');
        setRoadMarkings(value);
        setRoadMarkingsWeight(parseFloat(weight)); // Parse the weight string as a float
        console.log("RoadMarkings");
        console.log(value + " == "+ weight);
        }else{
            setRoadMarkings('');
            setRoadMarkingsWeight(0);       
        }
    };

    const handleRoadsideVegetationChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setRoadsideVegetation(value);
            setRoadsideVegetationWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("RoadsideVegetation");
            console.log(value + " == "+ weight);
        }else{
            setRoadsideVegetation('');
            setRoadsideVegetationWeight(0);       
        }
    };

    const handleDrainageSystemChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setDrainageSystem(value);
            setDrainageSystemWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("DrainageSystem");
            console.log(value + " == "+ weight);
        }else{
            setDrainageSystem('');
            setDrainageSystemWeight(0);       
        }
    };

    const handleCracksandPotholesChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setCracksandPotholes(value);
            setCracksandPotholesWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("CracksandPotholes");
            console.log(value + " == "+ weight);
        }else{
            setCracksandPotholes('');
            setCracksandPotholesWeight(0);       
        }
    };

    const handleSurfaceSmoothnessChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setSurfaceSmoothness(value);
            setSurfaceSmoothnessWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("SurfaceSmoothness");
            console.log(value + " == "+ weight);
        }else{
            setSurfaceSmoothness('');
            setSurfaceSmoothnessWeight(0);       
        }
    };

    const handleRuttingChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setRutting(value);
            setRuttingWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("Rutting");
            console.log(value + " == "+ weight);
        }else{
            setRutting('');
            setRuttingWeight(0);       
        }
    };

    const handleEdgeConditionChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setEdgeCondition(value);
            setEdgeConditionWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("EdgeCondition");
            console.log(value + " == "+ weight);
        }else{
            setEdgeCondition('');
            setEdgeConditionWeight(0);       
        }
    };

    const handleExcavationCompletionChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setExcavationCompletion(value);
            setExcavationCompletionWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("ExcavationCompletion");
            console.log(value + " == "+ weight);
        }else{
            setExcavationCompletion('');
            setExcavationCompletionWeight(0);       
        }
    };

    const handleFoundationStabilityChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setFoundationStability(value);
            setFoundationStabilityWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("FoundationStability");
            console.log(value + " == "+ weight);
        }else{
            setFoundationStability('');
            setFoundationStabilityWeight(0);       
        }
    };

    const handleMaterialQualityChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setMaterialQuality(value);
            setMaterialQualityWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("MaterialQuality");
            console.log(value + " == "+ weight);
        }else{
            setMaterialQuality('');
            setMaterialQualityWeight(0);       
        }
    };

    const handleEquipmentUtilizationChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setEquipmentUtilization(value);
            setEquipmentUtilizationWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("EquipmentUtilization");
            console.log(value + " == "+ weight);
        }else{
            setEquipmentUtilization('');
            setEquipmentUtilizationWeight(0);       
        }
    };

    const handleWorkforceProductivityChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setWorkforceProductivity(value);
            setWorkforceProductivityWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("WorkforceProductivity");
            console.log(value + " == "+ weight);
        }else{
            setWorkforceProductivity('');
            setWorkforceProductivityWeight(0);       
        }
    };

    const handleWaterSupplyChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setWaterSupply(value);
            setWaterSupplyWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("WaterSupply");
            console.log(value + " == "+ weight);
        }else{
            setWaterSupply('');
            setWaterSupplyWeight(0);       
        }
    };

    const handleBedRocksChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setBedRocks(value);
            setBedRocksWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("BedRocks");
            console.log(value + " == "+ weight);
        }else{
            setBedRocks('');
            setBedRocksWeight(0);       
        }
    };

    const handleClimateFavorabilityChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setClimateFavorability(value);
            setClimateFavorabilityWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("ClimateFavorability");
            console.log(value + " == "+ weight);
        }else{
            setClimateFavorability('');
            setClimateFavorabilityWeight(0);       
        }
    };

    const handleTrafficLightsFunctionalityChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setTrafficLightsFunctionality(value);
            setTrafficLightsFunctionalityWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("TrafficLightsFunctionality");
            console.log(value + " == "+ weight);
        }else{
            setTrafficLightsFunctionality('');
            setTrafficLightsFunctionalityWeight(0);       
        }
    };
    

    const handleTrafficSignalChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setTrafficSignal(value);
            setTrafficSignalWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("TrafficSignal");
            console.log(value + " == "+ weight);
        }else{
            setTrafficSignal('');
            setTrafficSignalWeight(0);       
        }
    };
    
    const handlePedestrianCrossingsChange = (selectedValue: string) => {
        if(selectedValue !== ""){
            const [value, tail] = selectedValue.split('(');
            const [weight] = tail.split(')');
            setPedestrianCrossings(value);
            setPedestrianCrossingsWeight(parseFloat(weight)); // Parse the weight string as a float
            console.log("PedestrianCrossings");
            console.log(value + " == "+ weight);
        }else{
            setPedestrianCrossings('');
            setPedestrianCrossingsWeight(0);       
        }
    };
    return(
        <div className="card mt-3">
            <div className="card-header">
                <center><h3>{projectName} Inspection Report</h3></center>
            </div>
            <div className="card-body">
                {props.phase <=1 &&
                        <>
                <form method="POST" id="formElem" encType="multipart/form-data">

                        {displayWarning &&
                            <div className="alert alert-danger" role='alert'>
                                    All fields must be filled out
                            </div>
                        }
                       
                        {displaySuccess &&
                            <div className="alert alert-success" role='alert'> 
                                    Report Generated Successfully
                             </div>
                        }
                        
                        <div className="row justify-content-center">
                            <div className="col-lg-7 col-md-9 col-sm-12">
                                <label className="form-label mt-3">
                                    Recepient(s) 
                                </label>&nbsp;
                                {recipients.map((recipient, index)=>(
                                    <input type="email" className="form-control mb-2"
                                    key={index}  
                                    placeholder="Recepient Email" onChange={e => handleRecipientChange(index, e.target.value)} value={recipient} />
                                ))}
                                <button className="btn-sm btn-primary" onClick={handleAddRecipient} type="button"> 
                                    Add Recipient
                                 </button>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <h3 className="mb-3 fw-light">Inspector Contacts: </h3>
                            <div className="col-md-4">
                                <label className="form-label mt-3">
                                    Name:
                                </label>    
                                <input type="text" className="form-control" placeholder="Full name" onChange={(e)=>{setInspectorName(e.target.value)}} value={inspectorName} required/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label mt-3">
                                    Phone Number:
                                </label>    
                                <input type="text" className="form-control" placeholder="Phone Number" onChange={(e)=>{setPhoneNumber(e.target.value)}} value={PhoneNumber} required/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label mt-3">
                                    Email: 
                                </label>    
                                <input type="email" className="form-control" placeholder="work email" onChange={(e)=>{setInspectorEmail(e.target.value)}} value={inspectorEmail} required/>
                            </div>
                        </div>

                        
                        <div className="row mt-5">
                            <h3 className="text-primary">Phase 3: Completion phase inspection</h3> 
                            
                        </div> 

                        <div className="row mt-5">
                            <h3 className="mb-3 fw-light">Road Initial Condition: </h3>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Pavement Condition</label>
                                <select className="form-control" 
                                // onChange={(e)=>{ setPavementCondition(e.target.value);}}
                                onChange={(e) => handlePavementConditionChange(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Excellent(10)">Excellent</option>
                                    <option value="Good(6.5)">Good</option>
                                    <option value="Fair(3)">Fair</option>
                                    <option value="Poor(-0.5)">Poor</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Road Markings and Signs</label>
                                <select className="form-control"
                                //  onChange={(e)=>{ setRoadMarkings(e.target.value);}}                                 
                                 onChange={(e) => handleRoadMarkingsChange(e.target.value)}
                                 >
                                    <option value="">Select</option>
                                    <option value="Clear and Visible(10)">Clear and Visible</option>
                                    <option value="Faded(7.5)">Faded</option>
                                    <option value="Damaged(5)">Damaged</option>
                                    <option value="Missing(2.5)">Missing</option>
                                    <option value="Inadequate(0)">Inadequate</option>                                    
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Roadside Vegetation</label>
                                <select className="form-control"                                 
                                onChange={(e) => handleRoadsideVegetationChange(e.target.value)}
                                // onChange={(e)=>{ setRoadsideVegetation(e.target.value);}}
                                >
                                    <option value="">Select</option>
                                    <option value="Clear and Well-Maintained(10)">Clear and Well-Maintained</option>
                                    <option value="Overgrown(7.5)">Overgrown</option>
                                    <option value="Encroaching onto Road(5)">Encroaching onto Road</option>
                                    <option value="Obstructing Visibility(2.5)">Obstructing Visibility</option>
                                    <option value="Hazardous(0)">Hazardous</option> 
                                </select>
                            </div>
                            
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Drainage System</label>
                                <select className="form-control"                                 
                                onChange={(e) => handleDrainageSystemChange(e.target.value)}
                                // onChange={(e)=>{ setDrainageSystem(e.target.value);}}
                                >
                                    <option value="">Select</option>
                                    <option value="Adequate(10)">Adequate</option>
                                    <option value="Partially Blocked(7.5)">Partially Blocked</option>
                                    <option value="Fully Blocked(5)">Fully Blocked</option>
                                    <option value="Damaged/Collapsed(2.5)">Damaged/Collapsed</option>
                                    <option value="Insufficient Capacity(0)">Insufficient Capacity</option> 
                                </select>
                            </div>                            

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Cracks and Potholes</label>
                                <select className="form-control" 
                                // onChange={(e)=>{ setCracksandPotholes(e.target.value);}}
                                onChange={(e) => handleCracksandPotholesChange(e.target.value)}                                
                                >
                                    <option value="">Select</option>
                                    <option value="None(10)">None</option>
                                    <option value="Minor(6.5)">Minor</option>
                                    <option value="Moderate(3)">Moderate</option>
                                    <option value="Severe(-0.5)">Severe</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Surface Smoothness</label>
                                <select className="form-control" 
                                // onChange={(e)=>{ setSurfaceSmoothness(e.target.value);}}
                                onChange={(e) => handleSurfaceSmoothnessChange(e.target.value)}                                  
                                >
                                    <option value="">Select</option>
                                    <option value="Very Smooth(10)">Very Smooth</option>
                                    <option value="Slightly Rough(6.5)">Slightly Rough</option>
                                    <option value="Moderately Rough(3)">Moderately Rough</option>
                                    <option value="Very Rough(-0.5)">Very Rough</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Rutting or Depressions</label>
                                <select className="form-control" 
                                // onChange={(e)=>{ setRutting(e.target.value);}}
                                onChange={(e) => handleRuttingChange(e.target.value)}                                
                                >
                                    <option value="">Select</option>
                                    <option value="None(10)">None</option>
                                    <option value="Minor(6.5)">Minor</option>
                                    <option value="Moderate(3)">Moderate</option>
                                    <option value="Severe(-0.5)">Severe</option>
                                </select>
                            </div>
                            
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Edge Condition</label>
                                <select className="form-control" 
                                // onChange={(e)=>{ setEdgeCondition(e.target.value);}}
                                onChange={(e) => handleEdgeConditionChange(e.target.value)}                                
                                >
                                    <option value="">Select</option>
                                    <option value="No Erosion(10)">No Erosion</option>
                                    <option value="Minor Erosion(6.5)">Minor Erosion</option>
                                    <option value="Moderate Erosion(3)">Moderate Erosion</option>
                                    <option value="Severe Erosion(-0.5)">Severe Erosion</option>
                                </select>
                            </div>

                        </div>

                        <div className="row mt-5">
                            <h3 className="mb-3 fw-light">Road Construction Progress: </h3>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Excavation Completion</label>
                                <select className="form-control" 
                                onChange={(e) => handleExcavationCompletionChange(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="On Schedule(10)">On Schedule</option>
                                    <option value="Minor Delays(5)">Minor Delays</option>
                                    <option value="Significant Delays(0)">Significant Delays</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Foundation Stability</label>
                                <select className="form-control" 
                                onChange={(e) => handleFoundationStabilityChange(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Solid and Stable(10)">Solid and Stable</option>
                                    <option value="rigid(5)">rigid</option>
                                    <option value="Unstable(0)">Unstable</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Material Quality</label>
                                <select className="form-control"
                                 onChange={(e) => handleMaterialQualityChange(e.target.value)}
                                 >
                                    <option value="">Select</option>
                                    <option value="High Quality(10)">High Quality</option>
                                    <option value="Defective(5)">Defective</option>
                                    <option value="Poor Quality(0)">Poor Quality</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>
                            
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Equipment Utilization</label>
                                <select className="form-control" 
                                onChange={(e) => handleEquipmentUtilizationChange(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Optimal Use(10)">Optimal Use</option>
                                    <option value="Moderate Use(5)">Moderate Use</option>
                                    <option value="Inefficient Use(0)">Inefficient Use</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Workforce Productivity</label>
                                <select className="form-control" 
                                onChange={(e) => handleWorkforceProductivityChange(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Efficient and Timely(10)">Efficient and Timely</option>
                                    <option value="Delayed Output(5)">Delayed Output</option>
                                    <option value="Low Productivity(0)">Low Productivity</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Water Supply Availability</label>
                                <select className="form-control" 
                                onChange={(e) => handleWaterSupplyChange(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Adequate(10)">Adequate</option>
                                    <option value="Limited(5)">Limited</option>
                                    <option value="Unavailable(0)">Unavailable</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Existence of Bed Rocks</label>
                                <select className="form-control"
                                 onChange={(e) => handleBedRocksChange(e.target.value)}
                                 >
                                    <option value="">Select</option>
                                    <option value="None(10)">None</option>
                                    <option value="Moderate(5)">Moderate</option>
                                    <option value="Severe(0)">Severe</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Climate Favorability</label>
                                <select className="form-control"
                                 onChange={(e) => handleClimateFavorabilityChange(e.target.value)}
                                 >
                                    <option value="">Select</option>
                                    <option value="Favorable(10)">Favorable</option>
                                    <option value="Moderate(5)">Moderate</option>
                                    <option value="Challenging(0)">Challenging</option>
                                    <option value="Not Applicable(10)">Not Applicable</option>
                                </select>
                            </div>

                        </div>

                        <div className="row mt-4">
                            <h3 className="mb-3 fw-light">Site images: </h3>
                                <div className="col-md-3">
                                    <input id="fileInput" className="col-sm form-control" type="file" multiple onChange={e => base64ConversionForImages(e)} />
                                </div>    
                                <div className="col-sm">
                                     <input type="button" className="btn-sm btn-dark" value="Reset" onClick={()=> {setSelectedImages([]); setbase64Images([])}} />
                                </div>
                                    
                        </div>
                             
                        <div className="row mt-5">                        
                                {
                                    base64Images.map((image: any) =>(
                                        <div className="col-sm-12 col-md-12 col-lg-5" key={image}>
                                             {/* <img src={image} className="img-thumbnail" alt="" height={200} width={200}/> */}
                                             <img src={image} alt="" height={400} width={400} style={{objectFit:'cover'}} key={image}/>                             
                                                 
                                       </div>
                                    ))
                                }                                                    
                        </div>
                        
                        <div className='dropdown row mt-2' style={{ cursor: 'pointer' }}>
                                <h3 className='dropdown-toggle fw-light' id='dropdownMenuButton1' 
                                data-bs-toggle='dropdown'>
                                    Rate and Comment
                                </h3>
                                <ul className="dropdown-menu" id='submitReviewRating'
                                aria-labelledby='dropdownMenuButton1'>
                                    <li><button onClick={() => startValue(0)} className='dropdown-item' type="button">0 star</button></li>
                                    <li><button onClick={() => startValue(.5)} className='dropdown-item' type="button">.5 star</button></li>
                                    <li><button onClick={() => startValue(1)} className='dropdown-item' type="button">1 star</button></li>
                                    <li><button onClick={() => startValue(1.5)} className='dropdown-item' type="button">1.5 star</button></li>
                                    <li><button onClick={() => startValue(2)} className='dropdown-item' type="button">2 star</button></li>
                                    <li><button onClick={() => startValue(2.5)} className='dropdown-item' type="button">2.5 star</button></li>
                                    <li><button onClick={() => startValue(3)} className='dropdown-item' type="button">3 star</button></li>
                                    <li><button onClick={() => startValue(3.5)} className='dropdown-item' type="button">3.5 star</button></li>
                                    <li><button onClick={() => startValue(4)} className='dropdown-item' type="button">4 star</button></li>
                                    <li><button onClick={() => startValue(4.5)} className='dropdown-item' type="button">4.5 star</button></li>
                                    <li><button onClick={() => startValue(5)} className='dropdown-item' type="button">5 star</button></li>
                                </ul>
                                <StarsReview Rating={starInput} size={32}/>
                            
                            {displayInput && 
                                <div>
                                    <hr />
                                    <div className='mb-3'>
                                        <label className='form-label'>
                                            Comment
                                        </label>
                                        <textarea className='form-control' id='submitReviewDescription' 
                                        placeholder='Optional' rows={3} onChange={e => setReviewDescription(e.target.value)}
                                        value={reviewDescription}
                                        >

                                        </textarea>
                                    </div>
                                </div>
                            }
                        </div>
                        
                        {/* <div className="row mt-5">
                            <LeaveAReview submitReview={submitReview}/>
                        </div> */}

                        <div className="row mt-5">
                                <div className="col-md-3 mt-3">
                                    <button onClick={()=> {submitInspectionReport();  displayInput && submitReview(starInput, reviewDescription);}} type="button" className="btn-lg btn-success">
                                        Submit
                                    </button>
                                </div>  
                        </div>

                            {/* </>
                        } */}

                        {/* {projectType === 'road' &&
                            <>
                            <div className="row mt-5">
                                <h3 className="fw-light">Phase 1: Site Preparation</h3>
                            </div>                           
                            </>
                        } */}
                </form>

                </>
                    }
                {props.phase ==2 &&
                    <>
                    <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">Phase 1 Completed!</h4>
                    <p>The successful completion of Phase One in our Roads and Utilities Inspection Project marks a key milestone. Strict adherence to protocols and compliance requirements ensures that we are now fully prepared to move on to Phase Two</p>
                    <hr/>
                    <p className="mb-0">The inspection process verifies that this project shall proceeed to phase 2</p>
                  </div>
                  </>
                }
            </div>            
        </div>
    )
}