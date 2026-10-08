package com.tanvi.servicedesk;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @PostMapping
    public Ticket createTicket(@Valid @RequestBody Ticket ticket) {
        if (!Set.of("LOW", "MEDIUM", "HIGH").contains(ticket.getPriority())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Priority must be LOW, MEDIUM, or HIGH");
        }

        ticket.setStatus("OPEN");
        ticket.setCategory(detectCategory(ticket));
        return ticketRepository.save(ticket);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam String status) {
        if (!Set.of("OPEN", "IN_PROGRESS", "RESOLVED").contains(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid ticket status");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    private String detectCategory(Ticket ticket) {
        String text = (ticket.getTitle() + " " + ticket.getDescription())
                .toLowerCase(Locale.ROOT);

        if (text.contains("wi-fi") || text.contains("wifi")
                || text.contains("internet") || text.contains("network")
                || text.contains("router")) {
            return "NETWORK";
        }

        if (text.contains("laptop") || text.contains("printer")
                || text.contains("keyboard") || text.contains("monitor")
                || text.contains("mouse")) {
            return "HARDWARE";
        }

        if (text.contains("software") || text.contains("app")
                || text.contains("login") || text.contains("password")
                || text.contains("install")) {
            return "SOFTWARE";
        }

        return "OTHER";
    }
}