package com.mkr.springbootlibrary.controller;

import com.mkr.springbootlibrary.Service.AdminService;
import com.mkr.springbootlibrary.Utils.ExtractJWT;
import com.mkr.springbootlibrary.requestModels.AddBookRequest;
import com.mkr.springbootlibrary.requestModels.AddProjectRequest;
import com.mkr.springbootlibrary.requestModels.AddReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.logging.Logger;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private AdminService adminService;

    private Logger logger = Logger.getLogger(getClass().getName());
    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value = "Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value = "Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.decreaseBookQuantity(bookId);
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value="Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }

    @PostMapping("/secure/add/project")
    public void postProject(@RequestHeader(value="Authorization") String token,
                            @RequestBody AddProjectRequest addProjectRequest) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        logger.info(addProjectRequest.getWeather_conditions());
        adminService.postProject(addProjectRequest);
    }

    @PostMapping("/secure/add/report")
    public void postReport(@RequestHeader(value="Authorization") String token,
                            @RequestBody AddReportRequest addReportRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        logger.info(addReportRequest.getExcel());
        logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        if(addReportRequest.getExcel().length()>0){
            String partSeparator = ",";
            if (addReportRequest.getExcel().contains(partSeparator)) {
                String encodedRpt = addReportRequest.getExcel().split(partSeparator)[1];
                byte[] reportBytes = Base64.getDecoder().decode(encodedRpt);
                logger.info(reportBytes.toString());
            }
            else{
                logger.info("Poor base64 string format.");
            }
        }else{
            logger.info("No report base64String");
        }
       // adminService.postReport(addReportRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value="Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(bookId);
    }
}
