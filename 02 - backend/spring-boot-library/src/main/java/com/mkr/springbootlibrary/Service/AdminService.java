package com.mkr.springbootlibrary.Service;

import com.mkr.springbootlibrary.Entity.Book;
import com.mkr.springbootlibrary.Entity.Image;
import com.mkr.springbootlibrary.Entity.Project;
import com.mkr.springbootlibrary.Entity.Report;
import com.mkr.springbootlibrary.dao.*;
import com.mkr.springbootlibrary.requestModels.AddBookRequest;
import com.mkr.springbootlibrary.requestModels.AddProjectRequest;
import com.mkr.springbootlibrary.requestModels.AddReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.logging.Logger;

@Service
@Transactional
public class AdminService {
    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;
    private ProjectRepository projectRepository;

    private ReportRepository reportRepository;
    private ImageRepository imageRepository;

    private Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    public AdminService(BookRepository bookRepository, ProjectRepository projectRepository,
                        ReportRepository reportRepository,
                        ImageRepository imageRepository,
                        ReviewRepository reviewRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
        this.projectRepository = projectRepository;
        this.imageRepository = imageRepository;
        this.reportRepository = reportRepository;
    }

    public void increaseBookQuantity(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        bookRepository.save(book.get());
    }

    public void decreaseBookQuantity(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopiesAvailable() <=0 || book.get().getCopies()<=0){
            throw new Exception("Book not found or quantity locked");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        bookRepository.save(book.get());
    }
    public void postBook(AddBookRequest addBookRequest){
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());
        bookRepository.save(book);
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
        Report report = new Report();
        report.setProjectName(addReportRequest.getProjectName());
        report.setProject_type(addReportRequest.getProjectType());
        report.setDate(addReportRequest.getDate());
        report.setExcel_report(addReportRequest.getExcel());

        logger.info(addReportRequest.getExcel());
        logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        logger.info(report.getExcel_report());
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

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }
        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }
}
