package com.mkr.springbootlibrary.dao;
import com.mkr.springbootlibrary.Entity.InspectorReview;
import com.mkr.springbootlibrary.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InspectorReviewRepository extends JpaRepository<InspectorReview, Long> {
    List<InspectorReview> findByUserEmailAndProjectId(String userEmail, Long ProjectId);
    Page<InspectorReview> findByProjectId(@RequestParam("project_id") Long projectId, Pageable pageable);
}
