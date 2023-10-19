package com.mkr.Inspection.Service;

import com.mkr.Inspection.Entity.InspectorReview;
import com.mkr.Inspection.Entity.Project;
import com.mkr.Inspection.Entity.Review;
import com.mkr.Inspection.dao.InspectorReviewRepository;
import com.mkr.Inspection.dao.ProjectRepository;
import com.mkr.Inspection.dao.ReviewRepository;
import com.mkr.Inspection.requestModels.InspectorReviewRequest;
import com.mkr.Inspection.requestModels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
@Transactional
public class ReviewService {
    private ReviewRepository reviewRepository;

    private InspectorReviewRepository inspectorReviewRepository;

    private ProjectRepository projectRepository;

    private Logger logger = Logger.getLogger(getClass().getName());
    @Autowired
    public ReviewService(ReviewRepository reviewRepository, InspectorReviewRepository inspectorReviewRepository,
                         ProjectRepository projectRepository) {
        this.reviewRepository = reviewRepository;
        this.inspectorReviewRepository = inspectorReviewRepository;
        this.projectRepository = projectRepository;
    }
    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception{
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if(validateReview != null){
            throw new Exception("Review already created");
        }
        Review review = new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        if(reviewRequest.getReviewDescription().isPresent()){
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }

    public void postInspectorReview(String userEmail, InspectorReviewRequest inspectorReviewRequest) throws Exception{
        List<InspectorReview> validateReview = inspectorReviewRepository.findByUserEmailAndProjectId(userEmail, inspectorReviewRequest.getProjectId());
        //logger.info(inspectorReviewRequest.toString());
                Optional<Project> project = projectRepository.findById(inspectorReviewRequest.getProjectId());

        if(!project.isPresent()){
            throw new Exception("Project doesn't exit");
        }
//        if(validateReview != null){
//            throw new Exception("Review already created");
//        }
        InspectorReview inspectorReview = new InspectorReview();
        inspectorReview.setRating(inspectorReviewRequest.getRating());
        inspectorReview.setUserEmail(userEmail);
        if(inspectorReviewRequest.getReviewDescription().isPresent()){
            inspectorReview.setReviewDescription(inspectorReviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }
        inspectorReview.setDate(Date.valueOf(LocalDate.now()));
        project.get().addReview(inspectorReview);
        inspectorReviewRepository.save(inspectorReview);
    }
    public Boolean userReviewListed(String userEmail, Long bookId){
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(validateReview != null) {
            return true;
        }else{
            return false;
        }
    }

    public Boolean userReviewListed2(String userEmail, Long projectId){
        List<InspectorReview> validateReview = inspectorReviewRepository.findByUserEmailAndProjectId(userEmail, projectId);
        if(validateReview != null) {
            return true;
        }else{
            return false;
        }
    }
}
