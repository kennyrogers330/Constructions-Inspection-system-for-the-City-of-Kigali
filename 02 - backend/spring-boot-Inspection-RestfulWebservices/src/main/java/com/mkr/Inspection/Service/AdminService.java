package com.mkr.Inspection.Service;

import com.mkr.Inspection.Entity.*;
import com.mkr.Inspection.dao.*;
import com.mkr.Inspection.requestModels.AddProjectRequest;
import com.mkr.Inspection.requestModels.AddReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.logging.Logger;

@Service
@Transactional
public class AdminService {
    private ReviewRepository reviewRepository;
    private ProjectRepository projectRepository;
    private ReportRepository reportRepository;
    private ImageRepository imageRepository;

    private Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    public AdminService(ReviewRepository reviewRepository, ProjectRepository projectRepository,
                        ReportRepository reportRepository, ImageRepository imageRepository) {
        this.reviewRepository = reviewRepository;
        this.projectRepository = projectRepository;
        this.reportRepository = reportRepository;
        this.imageRepository = imageRepository;
    }
    public void postProject(AddProjectRequest addProjectRequest){
        Project project = new Project();
        project.setTitle(addProjectRequest.getTitle());
        project.setDescription(addProjectRequest.getDescription());
        project.setStart_date(addProjectRequest.getStart_date());
        project.setLocation(addProjectRequest.getLocation());
        project.setProject_type(addProjectRequest.getProject_type());
        project.setWeather_conditions(addProjectRequest.getWeather_conditions());
        project.setExpected_duration(addProjectRequest.getExpected_duration());
        project.setProject_manager(addProjectRequest.getProject_manager());
        project.setContact_email(addProjectRequest.getContact_email());
        project.setContact_phone(addProjectRequest.getContact_phone());

        for (String a : addProjectRequest.getImages()){
            Image img  = new Image();
            img.setImage(a);
            project.add(img);
            imageRepository.save(img);
        }
        projectRepository.save(project);

    }

    public void postReport(AddReportRequest addReportRequest) throws Exception {

        Report validateReport = reportRepository.findByProjectNameAndProjectId(addReportRequest.getProjectName(), Long.parseLong(addReportRequest.getProjectId()));

        if(validateReport != null){

            if(validateReport.getProgress() + addReportRequest.getProgress() >= 100){
                Report report = new Report();
                report.setProjectName(addReportRequest.getProjectName());
                report.setProject_type(addReportRequest.getProjectType());
                report.setDate(addReportRequest.getDate());
                report.setExcel_report(addReportRequest.getExcel());
                report.setComment(addReportRequest.getComment());
                report.setProgress(addReportRequest.getProgress());
                report.setPhase(addReportRequest.getPhase() + 1);
                report.setInspectorName(addReportRequest.getInspectorName());
                report.setPhoneNumber(addReportRequest.getInspectorPhone());

                for (String a : addReportRequest.getImages()){
                    Image img  = new Image();
                    img.setImage(a);
                    report.add(img);
                    imageRepository.save(img);
                }
                Optional<Project> project = projectRepository.findById(Long.valueOf(addReportRequest.getProjectId()));
                if(project.isEmpty()){
                    throw new Exception("project not found");
                }
                validateReport.setProgress(Double.parseDouble("100"));
                reportRepository.save(validateReport);
                project.get().addReport(report);
                reportRepository.save(report);
                return;
            }
            validateReport.setProjectName(addReportRequest.getProjectName());
            validateReport.setProject_type(addReportRequest.getProjectType());
            validateReport.setDate(addReportRequest.getDate());
            validateReport.setExcel_report(addReportRequest.getExcel());
            validateReport.setComment(addReportRequest.getComment());
            validateReport.setProgress(validateReport.getProgress() + addReportRequest.getProgress());
            validateReport.setPhase(addReportRequest.getPhase());
            validateReport.setInspectorName(addReportRequest.getInspectorName());
            validateReport.setPhoneNumber(addReportRequest.getInspectorPhone());
            for (String a : addReportRequest.getImages()){
                Image img  = new Image();
                img.setImage(a);
                validateReport.add(img);
                imageRepository.save(img);
            }
            reportRepository.save(validateReport);
            return;
        }
        Report report = new Report();
        report.setProjectName(addReportRequest.getProjectName());
        report.setProject_type(addReportRequest.getProjectType());
        report.setDate(addReportRequest.getDate());
        report.setExcel_report(addReportRequest.getExcel());
        report.setComment(addReportRequest.getComment());
        report.setProgress(addReportRequest.getProgress());
        report.setPhase(addReportRequest.getPhase());
        report.setInspectorName(addReportRequest.getInspectorName());
        report.setPhoneNumber(addReportRequest.getInspectorPhone());
//        logger.info(addReportRequest.getExcel());
        logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
//        logger.info(report.getExcel_report());
        for (String a : addReportRequest.getImages()){
            Image img  = new Image();
            img.setImage(a);
            report.add(img);
            imageRepository.save(img);
        }
        Optional<Project> project = projectRepository.findById(Long.valueOf(addReportRequest.getProjectId()));
        if(!project.isPresent()){
            throw new Exception("project not found");
        }
        project.get().addReport(report);
        reportRepository.save(report);
    }

}
