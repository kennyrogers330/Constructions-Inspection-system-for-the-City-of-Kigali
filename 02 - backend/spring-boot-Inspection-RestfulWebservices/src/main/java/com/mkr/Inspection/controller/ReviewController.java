package com.mkr.Inspection.controller;

import com.mkr.Inspection.Service.ReviewService;
import com.mkr.Inspection.Utils.ExtractJWT;
import com.mkr.Inspection.requestModels.InspectorReviewRequest;
import com.mkr.Inspection.requestModels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;
    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(@RequestHeader(value="Authorization") String token,
                                    @RequestParam Long bookId) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, bookId);
    }

    //userReviewListed2
    @GetMapping("/secure/user/project")
    public Boolean reviewProjectByUser(@RequestHeader(value="Authorization") String token,
                                    @RequestParam Long projectId) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed2(userEmail, projectId);
    }
    @PostMapping("/secure")
    public void postReview(@RequestHeader(value="Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws  Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }

    @PostMapping("/secure/post")
    public void postInspectorReview(@RequestHeader(value="Authorization") String token,
                           @RequestBody InspectorReviewRequest inspectorReviewRequest) throws  Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        reviewService.postInspectorReview(userEmail, inspectorReviewRequest);
    }
}
