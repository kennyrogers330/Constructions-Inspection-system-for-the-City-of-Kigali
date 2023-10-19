package com.mkr.Inspection.dao;

import com.mkr.Inspection.Entity.InspectorReview;
import com.mkr.Inspection.Entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Report findByProjectNameAndProjectId(String projectName, Long ProjectId);
}
