package com.myfitbuddy.backend.modules.workout;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfitbuddy.backend.modules.safety.SafetyEngine;
import com.myfitbuddy.backend.modules.user.FitnessProfile;
import com.myfitbuddy.backend.modules.user.FitnessProfileRepository;
import com.myfitbuddy.backend.modules.user.User;
import com.myfitbuddy.backend.modules.user.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WorkoutGeneratorService {

    private final ChatClient chatClient;

    @Autowired
    private SafetyEngine safetyEngine;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FitnessProfileRepository fitnessProfileRepository;

    @Value("classpath:/prompts/system-workout.st")
    private Resource systemPromptResource;

    @Value("classpath:/prompts/user-request.st")
    private Resource userPromptResource;

    @Autowired
    private ObjectMapper objectMapper;

    private String loadResourceAsString(Resource resource) {
        try (java.io.InputStream is = resource.getInputStream()) {
            return new String(is.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to read resource: " + resource, e);
        }
    }

    public WorkoutGeneratorService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public WorkoutPlan generateWorkout(Long userId, String goal, String preferences) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FitnessProfile profile = fitnessProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Construct User Prompt
        String userMessage = loadResourceAsString(userPromptResource)
                .replace("{age}", String.valueOf(profile.getBiometrics().getAge()))
                .replace("{gender}", profile.getBiometrics().getGender())
                .replace("{weight}", String.valueOf(profile.getBiometrics().getWeight()))
                .replace("{height}", String.valueOf(profile.getBiometrics().getHeight()))
                .replace("{goal}", goal)
                .replace("{equipment}", String.join(", ", profile.getEquipment()))
                .replace("{injuries}", String.join(", ", profile.getInjuries()))
                .replace("{preferences}", preferences);

        // Construct System Prompt
        String systemMessage = loadResourceAsString(systemPromptResource);

        // Call AI
        // Note: In a real app we'd use a more robust way to set system prompt,
        // e.g. .defaultSystem() on builder or separate SystemMessage object.
        // For simplicity with this version of Spring AI, we'll prepend/combine or use
        // call options.
        // Using valid Spring AI ChatClient fluent API:
        String response = chatClient.prompt()
                .system(systemMessage)
                .user(userMessage)
                .call()
                .content();

        // Parse Response
        WorkoutPlan.PlanDetails planDetails;
        try {
            planDetails = objectMapper.readValue(response, WorkoutPlan.PlanDetails.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }

        WorkoutPlan plan = new WorkoutPlan(planDetails);

        // Validate Plan
        if (!safetyEngine.validatePlan(plan, profile)) {
            // In a real system, we might loop and ask AI to fix it.
            // For now, we throw an exception or return null to indicate failure/violation.
            throw new RuntimeException(
                    "Generated plan failed safety checks (e.g., contraindicated exercises for injuries).");
        }

        return plan;
    }
}
