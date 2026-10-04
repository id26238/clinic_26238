package kigali.clinic.rw.controller;

import kigali.clinic.rw.domain.Office;
import kigali.clinic.rw.service.OfficeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offices")
public class OfficeController {

    @Autowired
    private OfficeService service;

    @GetMapping
    public List<Office> getAll() { return service.getAll(); }

    @PostMapping
    public Office save(@RequestBody Office o) { return service.save(o); }

    @GetMapping("/busiest")
    public Object busiest() { return service.busiest(); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}