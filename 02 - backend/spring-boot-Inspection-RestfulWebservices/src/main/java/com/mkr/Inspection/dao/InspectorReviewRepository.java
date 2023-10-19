package com.mkr.Inspection.dao;
import com.mkr.Inspection.Entity.InspectorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InspectorReviewRepository extends JpaRepository<InspectorReview, Long> {
    List<InspectorReview> findByUserEmailAndProjectId(String userEmail, Long ProjectId);
    Page<InspectorReview> findByProjectId(@RequestParam("project_id") Long projectId, Pageable pageable);
}
