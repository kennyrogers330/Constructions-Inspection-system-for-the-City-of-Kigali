package com.mkr.springbootlibrary.dao;

import com.mkr.springbootlibrary.Entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
