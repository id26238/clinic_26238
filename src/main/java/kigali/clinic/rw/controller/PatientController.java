package kigali.clinic.rw.controller;

import kigali.clinic.rw.domain.Patient;
import kigali.clinic.rw.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService service;

    @GetMapping
    public List<Patient> getAll() { return service.getAll(); }

    @PostMapping
    public Patient save(@RequestBody Patient p) { return service.save(p); }

    @GetMapping("/by-last-name")
    public List<Patient> byLastName(@RequestParam String lastName) {
        return service.byLastName(lastName);
    }

    @GetMapping("/of-doctor/{doctorId}")
    public ResponseEntity<?> ofDoctor(@PathVariable Long doctorId) {
        List<Patient> result = service.ofDoctor(doctorId);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("The doctor with that id does not exist");
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/frequent")
    public List<Patient> frequent(@RequestParam long min) {
        return service.frequent(min);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}